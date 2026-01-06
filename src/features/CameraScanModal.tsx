import { type FC, useState, type ChangeEvent } from 'react';
import { Camera, Loader2, Upload, AlertCircle } from 'lucide-react';
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Process with Gemini
        await processImage(file);
    };

    const processImage = async (file: File) => {
        setIsLoading(true);
        setError('');

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64ImageData = (reader.result as string).split(',')[1];
            try {
                const prompt = `Analyze this image of a drink container. Extract the drink type (e.g., beer, wine), volume in ml, and ABV %. Respond ONLY with JSON: {"type": string, "volume": number, "abv": number}.`;
                const resultText = await generateGeminiInsight(prompt, base64ImageData);

                if (resultText) {
                    // Clean markdown code blocks if present
                    const cleanText = resultText.replace(/```json\n|\n```/g, '').replace(/```/g, '').trim();
                    const jsonMatch = cleanText.match(/\{.*\}/s);

                    if (jsonMatch) {
                        const data = JSON.parse(jsonMatch[0]);
                        // Basic validation
                        if (data && data.type && typeof data.volume === 'number' && typeof data.abv === 'number') {
                            onScanSuccess(data);
                            onClose();
                            setPreview(null); // Reset preview
                        } else {
                            throw new Error("Missing required fields (type, volume, abv)");
                        }
                    } else {
                        throw new Error("Invalid format received from AI");
                    }
                } else {
                    throw new Error("No result");
                }
            } catch (err: any) {
                console.error("Scan error:", err);
                setError(t('scan_error_alert') + " " + (err.message || ""));
            } finally {
                setIsLoading(false);
            }
        };
        reader.onerror = () => {
            setError("Error reading file");
            setIsLoading(false);
        };
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('camera_modal_title')}>
            <div className="flex flex-col items-center">
                <div className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6 border border-gray-700 relative flex items-center justify-center">
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                        <div className="text-gray-600 flex flex-col items-center">
                            <Upload size={48} className="mb-2 opacity-50" />
                            <span className="text-sm">No image selected</span>
                        </div>
                    )}

                    {isLoading && (
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white backdrop-blur-sm z-10">
                            <Loader2 className="animate-spin mb-2" size={32} />
                            <span className="text-sm font-medium">{t('camera_modal_analyzing')}</span>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm w-full flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <p className="text-center text-gray-400 text-sm mb-6">{t('camera_modal_prompt')}</p>

                <div className="w-full relative">
                    <Button className="w-full" icon={<Camera size={20} />} disabled={isLoading}>
                        {isLoading ? t('camera_modal_analyzing') : t('camera_modal_capture')}
                    </Button>
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        onChange={handleFileChange}
                        disabled={isLoading}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center w-full">Compatible with mobile cameras and file uploads.</p>
            </div>
        </Modal>
    );
};
