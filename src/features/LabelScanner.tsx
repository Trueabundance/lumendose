import React, { useState, useRef, useEffect } from 'react';
import { analyzeDrinkLabel } from '../services/gemini';
import { ScanResult, DrinkType } from '../types';
import { Camera, Upload, RefreshCw, CheckCircle2, Zap, AlertTriangle, ShieldCheck, Edit3, Tag, FileText } from 'lucide-react';

interface LabelScannerProps {
  onAddDrink: (name: string, abv: number, volumeMl: number, type: DrinkType) => void;
  apiKey?: string;
  onClose?: () => void;
}

export const LabelScanner: React.FC<LabelScannerProps> = ({ onAddDrink, apiKey, onClose }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanTarget, setScanTarget] = useState<'auto' | 'front_brand' | 'back_nutrition'>('auto');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Editable fields in result card
  const [editName, setEditName] = useState<string>('');
  const [editAbv, setEditAbv] = useState<number>(5.0);
  const [editVolume, setEditVolume] = useState<number>(355);
  const [editType, setEditType] = useState<DrinkType>('beer');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    setScanResult(null);
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 }
        }
      });
      setStream(mediaStream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access unavailable. You can upload a photo label directly.');
      setCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const updateEditableFields = (result: ScanResult) => {
    setScanResult(result);
    setEditName(result.beverageName);
    setEditAbv(result.abv);
    setEditVolume(result.volumeMl);
    setEditType(result.type);
  };

  // Capture Frame from Video Stream
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !cameraActive) return;

    setIsScanning(true);
    setScanResult(null);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 1280;
      canvas.height = videoRef.current.videoHeight || 720;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // High quality sharpness draw
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        const base64Data = dataUrl.split(',')[1];

        const result = await analyzeDrinkLabel(base64Data, 'image/jpeg', apiKey, scanTarget);
        updateEditableFields(result);
      }
    } catch (err: any) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanResult(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const dataUrl = event.target?.result as string;
        const base64Data = dataUrl.split(',')[1];
        const mimeType = file.type || 'image/jpeg';

        const result = await analyzeDrinkLabel(base64Data, mimeType, apiKey, scanTarget);
        updateEditableFields(result);
      } catch (err) {
        console.error('File scan error:', err);
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Quick Sample Presets Test Buttons
  const handleQuickSampleTest = async (sampleBrand: string, abv: number, volume: number, type: DrinkType, notes: string) => {
    setIsScanning(true);
    await new Promise(r => setTimeout(r, 600));
    const std = Number(((volume * (abv / 100)) / 17.7).toFixed(1));
    const sampleRes: ScanResult = {
      beverageName: sampleBrand,
      type: type,
      abv: abv,
      volumeMl: volume,
      standardDrinks: std,
      confidence: 0.96,
      rawAnalysis: `OCR & Vision Match: ${notes}`,
      scanTimestamp: new Date().toLocaleTimeString()
    };
    updateEditableFields(sampleRes);
    setIsScanning(false);
  };

  const handleConfirmAdd = () => {
    if (!scanResult) return;
    onAddDrink(
      editName || scanResult.beverageName,
      editAbv,
      editVolume,
      editType
    );
    if (onClose) onClose();
  };

  const calculatedStd = Number(((editVolume * (editAbv / 100)) / 17.7).toFixed(1));

  return (
    <div className="space-y-5">
      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-400/40 text-cyan-300">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-lg text-cyan-300 text-glow-cyan">
              VISION LABEL RECOGNITION
            </h3>
            <p className="text-xs font-mono text-cyan-400/70">
              Front Brand Typography & Back Label Micro-Print OCR
            </p>
          </div>
        </div>

        {/* Camera Controls */}
        {cameraActive && (
          <button
            onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-cyan-500/30 text-cyan-400 text-xs font-mono hover:bg-cyan-500/10 cursor-pointer self-end sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>FLIP CAMERA</span>
          </button>
        )}
      </div>

      {/* Target Focus Selector */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 font-mono text-xs">
        <button
          onClick={() => setScanTarget('auto')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-orbitron transition-all ${
            scanTarget === 'auto'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-neon-cyan'
              : 'text-slate-400 hover:text-cyan-300'
          }`}
        >
          AUTO DETECT
        </button>
        <button
          onClick={() => setScanTarget('front_brand')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-orbitron transition-all flex items-center justify-center gap-1 ${
            scanTarget === 'front_brand'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-neon-cyan'
              : 'text-slate-400 hover:text-cyan-300'
          }`}
        >
          <Tag className="w-3.5 h-3.5" /> FRONT BRAND
        </button>
        <button
          onClick={() => setScanTarget('back_nutrition')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-orbitron transition-all flex items-center justify-center gap-1 ${
            scanTarget === 'back_nutrition'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-neon-cyan'
              : 'text-slate-400 hover:text-cyan-300'
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> BACK ABV/OCR
        </button>
      </div>

      {/* Camera Viewport & Reticle Overlay */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden glass-panel border border-cyan-500/40 flex items-center justify-center bg-black/90 hud-corner-box">
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-3">
            <AlertTriangle className="w-10 h-10 text-amber-400" />
            <p className="text-xs font-mono max-w-xs">{cameraError || 'Camera offline. Use photo upload below to scan label.'}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-orbitron text-xs hover:bg-cyan-500/30 cursor-pointer"
            >
              ENABLE CAMERA
            </button>
          </div>
        )}

        {/* Sci-Fi HUD Overlay Grid */}
        <div className="absolute inset-0 pointer-events-none border border-cyan-500/20 flex flex-col justify-between p-4">
          <div className="flex justify-between items-start text-[10px] font-mono text-cyan-400/80 bg-black/50 px-2.5 py-1 rounded border border-cyan-500/20">
            <span>TARGET: {scanTarget.toUpperCase().replace('_', ' ')}</span>
            <span>OCR: MULTI-PASS VISION</span>
          </div>

          {/* Reticle Focus Grid */}
          <div className="self-center w-52 h-52 sm:w-64 sm:h-64 border border-cyan-400/50 rounded-2xl relative flex items-center justify-center shadow-neon-cyan">
            <div className="w-4 h-4 border-t-2 border-l-2 border-cyan-400 absolute -top-1 -left-1" />
            <div className="w-4 h-4 border-t-2 border-r-2 border-cyan-400 absolute -top-1 -right-1" />
            <div className="w-4 h-4 border-b-2 border-l-2 border-cyan-400 absolute -bottom-1 -left-1" />
            <div className="w-4 h-4 border-b-2 border-r-2 border-cyan-400 absolute -bottom-1 -right-1" />

            {/* Laser Scanline Beam */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-neon-cyan animate-scan-line" />
            )}

            {!isScanning && (
              <div className="text-[11px] font-mono text-cyan-300/80 bg-black/70 px-3 py-1.5 rounded text-center border border-cyan-500/20">
                {scanTarget === 'front_brand' ? 'ALIGN FRONT BRAND LOGO' : scanTarget === 'back_nutrition' ? 'ALIGN BACK ABV / VOLUME TEXT' : 'ALIGN BEVERAGE LABEL HERE'}
              </div>
            )}
          </div>

          <div className="flex justify-between items-end text-[10px] font-mono text-cyan-400/80 bg-black/50 px-2.5 py-1 rounded border border-cyan-500/20">
            <span>FPS: 60 HD</span>
            <span>STATUS: {isScanning ? 'DECODING OCR...' : 'READY'}</span>
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Trigger Camera Scan */}
        <button
          onClick={captureAndAnalyze}
          disabled={!cameraActive || isScanning}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl font-orbitron text-xs font-bold tracking-wider transition-all ${
            cameraActive && !isScanning
              ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 shadow-neon-cyan cursor-pointer'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>{isScanning ? 'SCANNING & DECODING...' : 'CAPTURE & ANALYZE'}</span>
        </button>

        {/* Upload File Button */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            capture="environment"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/50 shadow-neon-purple font-orbitron text-xs font-bold tracking-wider transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>UPLOAD LABEL PHOTO</span>
          </button>
        </div>
      </div>

      {/* Quick Sample Label Test Buttons */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/20 space-y-2">
        <div className="text-[10px] font-mono text-cyan-400/80 uppercase">
          Quick Test Labels (1-Click Sample Recognition):
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <button
            onClick={() => handleQuickSampleTest('Heineken Original Pilsner', 5.0, 330, 'beer', 'Front Brand Logo recognized')}
            className="px-2.5 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 cursor-pointer"
          >
            🍺 Heineken (Front)
          </button>
          <button
            onClick={() => handleQuickSampleTest("Jack Daniel's Old No. 7", 40.0, 50, 'spirits', 'Back Label 40.0% ABV OCR')}
            className="px-2.5 py-1 rounded bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 cursor-pointer"
          >
            🥃 Jack Daniel's (Back)
          </button>
          <button
            onClick={() => handleQuickSampleTest('Corona Extra', 4.5, 355, 'beer', 'Front Brand Logo & Volume detected')}
            className="px-2.5 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 cursor-pointer"
          >
            🍺 Corona Extra (Front)
          </button>
          <button
            onClick={() => handleQuickSampleTest('Napa Valley Red Wine', 14.2, 150, 'wine', 'Back Label Fine Print 14.2% ABV')}
            className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 cursor-pointer"
          >
            🍷 Cabernet (Back)
          </button>
        </div>
      </div>

      {/* Scanned Interactive Result & Review Editor */}
      {scanResult && (
        <div className="p-5 rounded-2xl glass-panel-glow border border-emerald-500/40 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2 text-emerald-300 font-orbitron font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>BEVERAGE RECOGNITION COMPLETE</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              Confidence: {Math.round(scanResult.confidence * 100)}%
            </span>
          </div>

          {/* Editable Fields Grid */}
          <div className="space-y-3 bg-slate-950/70 p-4 rounded-xl border border-emerald-500/20">
            <div className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" /> VERIFY / EDIT DETECTED VALUES BEFORE LOGGING:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">BEVERAGE BRAND / NAME</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg px-2.5 py-1.5 text-white font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">ABV %</label>
                <input
                  type="number"
                  step="0.1"
                  value={editAbv}
                  onChange={(e) => setEditAbv(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg px-2.5 py-1.5 text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">VOLUME (ML)</label>
                <input
                  type="number"
                  step="5"
                  value={editVolume}
                  onChange={(e) => setEditVolume(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg px-2.5 py-1.5 text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-1">
              <span>Calculated Standard Drinks: <strong className="text-purple-300">{calculatedStd} Std</strong></span>
              <span className="text-slate-400">Scan Time: {scanResult.scanTimestamp}</span>
            </div>
          </div>

          <p className="text-xs font-mono text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-cyan-500/10">
            {scanResult.rawAnalysis}
          </p>

          <button
            onClick={handleConfirmAdd}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-orbitron font-bold text-xs tracking-wider shadow-neon-green hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>CONFIRM & LOG {editName.toUpperCase()} TO TELEMETRY</span>
          </button>
        </div>
      )}
    </div>
  );
};
