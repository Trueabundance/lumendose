import React from 'react';
import { Drink } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity, ShieldAlert, Heart, Brain, Moon, Clock, Download, TrendingDown } from 'lucide-react';

interface TelemetryDashboardProps {
  drinks: Drink[];
  bacEstimate: number;
  userWeightKg: number;
  onOpenScan: () => void;
  onOpenCoach: () => void;
}

export const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({
  drinks,
  bacEstimate,
  userWeightKg,
  onOpenScan,
  onOpenCoach
}) => {
  // Generate BAC Decay Curve timeline data over 8 hours
  const generateDecayCurve = () => {
    const data = [];
    const now = new Date();
    let currentBac = bacEstimate;

    for (let i = 0; i <= 8; i++) {
      const timePoint = new Date(now.getTime() + i * 60 * 60 * 1000);
      const timeLabel = timePoint.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Widmark elimination rate ~0.015% per hour
      const projectedBac = Math.max(0, currentBac - i * 0.015);

      data.push({
        time: i === 0 ? 'Now' : timeLabel,
        bac: Number(projectedBac.toFixed(3)),
        legalLimit: 0.05
      });
    }

    return data;
  };

  const decayData = generateDecayCurve();
  const totalDrinks = drinks.reduce((acc, d) => acc + d.standardDrinks, 0);

  // Biometric stress calculations
  const liverBurden = Math.min(100, Math.round(totalDrinks * 15));
  const hydrationIndex = Math.max(20, Math.round(100 - bacEstimate * 400));
  const cognitiveLatencyMs = Math.round(200 + bacEstimate * 1500);
  const sleepDisruption = Math.min(100, Math.round(bacEstimate * 600));

  const handleExportData = () => {
    const report = {
      timestamp: new Date().toISOString(),
      estimatedBac: bacEstimate,
      totalDrinksLogged: drinks.length,
      totalStandardDrinks: totalDrinks,
      drinkLog: drinks
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumendose-telemetry-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main Dial BAC Gauge Card */}
        <div className="md:col-span-2 glass-panel-glow p-6 rounded-2xl border border-cyan-500/40 flex flex-col justify-between relative overflow-hidden hud-corner-box">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> REAL-TIME BAC METER
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              WIDMARK TELEMETRY
            </span>
          </div>

          <div className="my-6 flex items-center justify-center relative">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-cyan-500/20 flex flex-col items-center justify-center relative shadow-neon-cyan bg-slate-950/60">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-ping opacity-25" />

              <span className="text-[11px] font-mono text-slate-400 uppercase">BLOOD ALCOHOL</span>
              <span className="font-orbitron font-extrabold text-3xl sm:text-4xl text-cyan-300 text-glow-cyan">
                {bacEstimate.toFixed(3)}%
              </span>
              <span className="text-[11px] font-mono text-cyan-400 mt-1">
                {bacEstimate === 0 ? 'Sober Baseline' : bacEstimate < 0.05 ? 'Mild Impairment' : 'High Impairment'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono border-t border-cyan-500/20 pt-3">
            <span className="text-slate-400">Total Standard Drinks: <strong className="text-white">{totalDrinks.toFixed(1)}</strong></span>
            <button
              onClick={onOpenCoach}
              className="text-purple-300 hover:text-purple-200 underline font-bold cursor-pointer"
            >
              Consult AI Coach →
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono text-purple-300">
              <span>Liver Processing</span>
              <Heart className="w-4 h-4" />
            </div>
            <div className="font-orbitron font-bold text-2xl text-purple-200 mt-2">{liverBurden}%</div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2 overflow-hidden border border-purple-500/20">
              <div className="bg-purple-500 h-full transition-all" style={{ width: `${liverBurden}%` }} />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-300">
              <span>Hydration Status</span>
              <Activity className="w-4 h-4" />
            </div>
            <div className="font-orbitron font-bold text-2xl text-emerald-200 mt-2">{hydrationIndex}%</div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2 overflow-hidden border border-emerald-500/20">
              <div className="bg-emerald-500 h-full transition-all" style={{ width: `${hydrationIndex}%` }} />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono text-amber-300">
              <span>Cognitive Latency</span>
              <Brain className="w-4 h-4" />
            </div>
            <div className="font-orbitron font-bold text-2xl text-amber-200 mt-2">{cognitiveLatencyMs} <span className="text-xs font-mono">ms</span></div>
            <div className="text-[10px] font-mono text-amber-300/70 mt-1">Normal baseline: ~200ms</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono text-rose-300">
              <span>Sleep REM Penalty</span>
              <Moon className="w-4 h-4" />
            </div>
            <div className="font-orbitron font-bold text-2xl text-rose-200 mt-2">-{sleepDisruption}%</div>
            <div className="text-[10px] font-mono text-rose-300/70 mt-1">Deep sleep architecture impact</div>
          </div>
        </div>
      </div>

      {/* BAC Decay Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-orbitron font-bold text-lg text-cyan-300 text-glow-cyan flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-cyan-400" /> PROJECTED BAC ELIMINATION TIMELINE
            </h3>
            <p className="text-xs font-mono text-cyan-400/70 mt-0.5">
              8-Hour Widmark Ethanol Elimination Forecast (~0.015%/hr)
            </p>
          </div>

          <button
            onClick={handleExportData}
            className="px-3 py-1.5 rounded-xl border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT TELEMETRY</span>
          </button>
        </div>

        <div className="w-full h-64 sm:h-80 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={decayData}>
              <defs>
                <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 243, 255, 0.1)" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(5, 8, 20, 0.95)',
                  borderColor: 'rgba(0, 243, 255, 0.4)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontFamily: 'JetBrains Mono'
                }}
              />
              <Area type="monotone" dataKey="bac" stroke="#00f3ff" strokeWidth={3} fillOpacity={1} fill="url(#cyanGradient)" name="Estimated BAC (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
