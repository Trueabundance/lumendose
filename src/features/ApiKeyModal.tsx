import React, { useState } from 'react';
import { Modal } from '../components/Modal';
import { Key, ShieldCheck, Cpu, Check } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey
}) => {
  const [inputKey, setInputKey] = useState<string>(apiKey);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="GEMINI AI CONFIGURATION"
      subtitle="Vision Scanner & Neural Coach API Settings"
    >
      <form onSubmit={handleSave} className="space-y-5">
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-200 leading-relaxed">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm mb-1">
            <Cpu className="w-4 h-4" /> Multi-Model Fallback Engine
          </div>
          LumenDose connects to Gemini 2.5 Flash, 2.0 Flash, and 1.5 Flash models. If no API key is specified, the application uses built-in smart neural heuristics for offline operation.
        </div>

        <div>
          <label className="block text-xs font-mono text-cyan-400 mb-1.5 font-bold">
            Google Gemini API Key
          </label>
          <div className="relative">
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-900/90 border border-cyan-500/30 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 pr-10"
            />
            <Key className="w-4 h-4 text-cyan-400 absolute right-3 top-3.5" />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-[11px] font-mono text-slate-400">
          Status: {inputKey ? 'Custom API Key Active' : 'Offline / Environment Heuristics Active'}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-white/5 text-xs font-mono transition-all cursor-pointer"
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-slate-950 font-orbitron font-bold text-xs tracking-wider shadow-neon-cyan hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{savedSuccess ? 'SAVED!' : 'SAVE SETTINGS'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
