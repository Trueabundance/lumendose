import React from 'react';
import { Activity, Camera, Bot, Key, RotateCcw, Brain } from 'lucide-react';

interface NavbarProps {
  bacEstimate: number;
  onOpenScan: () => void;
  onOpenCoach: () => void;
  onOpenApiKey: () => void;
  onResetSession: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  bacEstimate,
  onOpenScan,
  onOpenCoach,
  onOpenApiKey,
  onResetSession,
  activeSection,
  setActiveSection
}) => {
  const getBacBadgeClass = () => {
    if (bacEstimate === 0) return 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40 shadow-neon-green';
    if (bacEstimate < 0.05) return 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40 shadow-neon-cyan';
    if (bacEstimate < 0.08) return 'border-amber-500/40 text-amber-300 bg-amber-950/40';
    return 'border-rose-500/40 text-rose-300 bg-rose-950/40 shadow-neon-rose animate-pulse';
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/20 px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveSection('telemetry')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 shadow-neon-cyan">
            <Brain className="w-6 h-6 animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-extrabold text-xl sm:text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-emerald-300 text-glow-cyan">
                LUMENDOSE
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-cyan-500/40 bg-cyan-950/60 text-cyan-300">
                v2.0 HUD
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyan-400/70 hidden sm:block">
              NEURO-BIOMETRIC ALCOHOL TELEMETRY
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-cyan-500/20">
          <button
            onClick={() => setActiveSection('telemetry')}
            className={`px-4 py-1.5 rounded-lg font-orbitron text-xs tracking-wider transition-all ${
              activeSection === 'telemetry'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-neon-cyan'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5'
            }`}
          >
            TELEMETRY
          </button>
          <button
            onClick={() => setActiveSection('brain')}
            className={`px-4 py-1.5 rounded-lg font-orbitron text-xs tracking-wider transition-all ${
              activeSection === 'brain'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-neon-cyan'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5'
            }`}
          >
            NEURAL MAP
          </button>
          <button
            onClick={() => setActiveSection('logger')}
            className={`px-4 py-1.5 rounded-lg font-orbitron text-xs tracking-wider transition-all ${
              activeSection === 'logger'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-neon-cyan'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5'
            }`}
          >
            DOSE LOG
          </button>
        </nav>

        {/* Live BAC Indicator & Quick Action HUD */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* BAC Telemetry Meter */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs ${getBacBadgeClass()}`}>
            <Activity className="w-4 h-4 animate-spin-slow" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 leading-none uppercase">Est. BAC</span>
              <span className="font-bold text-sm leading-tight">{bacEstimate.toFixed(3)}%</span>
            </div>
          </div>

          {/* Camera Scan Button */}
          <button
            onClick={onOpenScan}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 shadow-neon-cyan font-orbitron text-xs transition-all cursor-pointer"
            title="Scan Beverage Label"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">SCAN LABEL</span>
          </button>

          {/* AI Coach Button */}
          <button
            onClick={onOpenCoach}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/40 shadow-neon-purple font-orbitron text-xs transition-all cursor-pointer"
            title="Open AI Coach"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">AI COACH</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKey}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-400 border border-cyan-500/30 transition-all cursor-pointer"
            title="Gemini API Settings"
          >
            <Key className="w-4 h-4" />
          </button>

          {/* Reset Session */}
          <button
            onClick={onResetSession}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700/60 hover:border-rose-500/40 transition-all cursor-pointer"
            title="Reset Telemetry Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
