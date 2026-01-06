import { type FC, useRef, useState, useEffect } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { generateGeminiInsight } from '../services/gemini';

interface CameraScanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScanSuccess: (data: any) => void;
}

export const CameraScanModal: FC<CameraScanModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
    const { t } = useTranslation();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let stream: MediaStream | null = null;
        const startCamera = async () => {
            if (isOpen) {
                setError('');
                try {
                    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                        setError("Camera not supported.");
                        return;
                    }
                    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error("Camera error:", err);
                    setError("Camera permission denied.");
                }
            }
        };

        startCamera();

        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
            if (videoRef.current) videoRef.current.srcObject = null;
        };
    }, [isOpen]);

    const handleCapture = async () => {
        if (!videoRef.current || !canvasRef.current) return;
        setIsLoading(true);
        setError('');

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

        const base64ImageData = canvas.toDataURL('image/jpeg').split(',')[1];

        try {
            const prompt = `Analyze this image of a drink container. Extract the drink type (e.g., beer, wine), volume in ml, and ABV %. Respond ONLY with JSON: {"type": string, "volume": number, "abv": number}.`;
            const resultText = await generateGeminiInsight(prompt, base64ImageData);

            if (resultText) {
                // Clean markdown code blocks if present
                const cleanText = resultText.replace(/```json\n|\n```/g, '').replace(/```/g, '').trim();
                const jsonMatch = cleanText.match(/\{.*\}/s);

                if (jsonMatch) {
                    onScanSuccess(JSON.parse(jsonMatch[0]));
                    onClose();
                } else {
                    throw new Error("Invalid format received from AI");
                }
            } else {
                throw new Error("No result");
            }
        } catch (err) {
            console.error("Scan error:", err);
            setError(t('scan_error_alert'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('camera_modal_title')}>
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4 border border-gray-700">
                {!error ? (
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-red-400">
                        {error}
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden"></canvas>

                {isLoading && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                        <Loader2 className="animate-spin mb-2" size={32} />
                        <span className="text-sm font-medium">{t('camera_modal_analyzing')}</span>
                    </div>
                )}
            </div>

            <p className="text-center text-gray-400 text-sm mb-4">{t('camera_modal_prompt')}</p>

            <Button
                onClick={handleCapture}
                disabled={isLoading || !!error}
                className="w-full"
                icon={<Camera size={20} />}
            >
                {t('camera_modal_capture')}
            </Button>
        </Modal>
    );
};
