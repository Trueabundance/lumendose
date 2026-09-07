import React, { useState, useEffect } from 'react';
import { getAICoachAdvice } from '../services/gemini';
import { Drink, AICoachAdvice } from '../types';
import { Bot, Sparkles, Droplets, Clock, Send, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AICoachProps {
  drinks: Drink[];
  bacEstimate: number;
  userWeightKg: number;
  apiKey?: string;
  onLogWater: () => void;
}

export const AICoach: React.FC<AICoachProps> = ({
  drinks,
  bacEstimate,
  userWeightKg,
  apiKey,
  onLogWater
}) => {
  const [advice, setAdvice] = useState<AICoachAdvice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: 'Greetings. I am Lumina, your neural telemetry coach. I monitor your metabolic clearing curve and synaptic health in real-time.'
    }
  ]);
  const [isAsking, setIsAsking] = useState<boolean>(false);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const result = await getAICoachAdvice(drinks, bacEstimate, userWeightKg, apiKey);
      setAdvice(result);
    } catch (err) {
      console.error('Failed to load AI Coach telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, [drinks.length, bacEstimate, apiKey]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAsking) return;

    const userQ = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userQ }]);
    setChatInput('');
    setIsAsking(true);

    try {
      let aiReply = '';
      const qLower = userQ.toLowerCase();

      if (qLower.includes('drive') || qLower.includes('car')) {
        aiReply = bacEstimate > 0
          ? `WARNING: Your estimated BAC is ${bacEstimate.toFixed(3)}%. In most jurisdictions, driving over 0.05% or 0.08% BAC is illegal and highly dangerous. Estimated time to zero BAC is ${advice?.timeToZeroHours || (bacEstimate / 0.015).toFixed(1)} hours.`
          : 'Your BAC is at 0.00%. You are sober and clear to operate motor vehicles safely.';
      } else if (qLower.includes('water') || qLower.includes('hydrate')) {
        aiReply = advice?.hydrationTip || 'Drink at least 300ml of water with every alcoholic beverage to prevent cellular dehydration.';
      } else if (qLower.includes('hangover') || qLower.includes('tomorrow')) {
        aiReply = 'To minimize hangover severity: 1) Stop drinking alcohol 2 hours before sleep, 2) Drink 500ml water with electrolytes before bed, 3) Consume B-complex vitamins and antioxidants.';
      } else {
        aiReply = `Based on your telemetry (${drinks.length} drinks logged, ~${bacEstimate.toFixed(3)}% BAC), your cognitive latency is currently ${bacEstimate > 0.05 ? 'moderately elevated' : 'baseline'}. ${advice?.cognitiveStatus || ''}`;
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: 'Telemetry query processed. Maintain baseline hydration.' }]);
    } finally {
      setIsAsking(false);
    }
  };

  const getRiskBadgeClass = (risk?: AICoachAdvice['riskLevel']) => {
    switch (risk) {
      case 'OPTIMAL':
        return 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-neon-green';
      case 'MILD_ELEVATION':
        return 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 shadow-neon-cyan';
      case 'COGNITIVE_DECAY':
        return 'bg-amber-950/60 border-amber-500/40 text-amber-300';
      case 'SEVERE_HAZARD':
        return 'bg-rose-950/60 border-rose-500/40 text-rose-300 shadow-neon-rose animate-pulse';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Lumina Avatar Header */}
      <div className="flex flex-col sm:flex-row items-center gap-4 glass-panel-glow p-5 rounded-2xl border border-purple-500/30">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-purple-950/80 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-neon-purple">
            <Bot className="w-10 h-10 animate-pulse" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-neon-green" />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-orbitron font-bold text-purple-300 text-glow-purple">
              LUMINA AI NEURO-COACH
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
              ACTIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs font-mono text-slate-300 mt-1">
            Biometric analysis grounded in Widmark metabolic decay & synaptic receptor dynamics.
          </p>
        </div>

        <button
          onClick={fetchAdvice}
          disabled={loading}
          className="px-3 py-1.5 rounded-xl border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>RE-ANALYZE</span>
        </button>
      </div>

      {/* Warning Alert Banner if active */}
      {advice?.warningAlert && (
        <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/50 text-rose-200 flex items-start gap-3 shadow-neon-rose animate-pulse">
          <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-orbitron font-bold text-xs uppercase tracking-wider text-rose-300">
              SAFETY WARNING ALERT
            </div>
            <p className="text-xs font-mono mt-1 text-rose-100">{advice.warningAlert}</p>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      {advice && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Status Badge */}
          <div className={`p-4 rounded-2xl border flex flex-col justify-between ${getRiskBadgeClass(advice.riskLevel)}`}>
            <div className="text-[10px] font-mono uppercase tracking-wider opacity-80">Biometric Risk Status</div>
            <div className="font-orbitron font-extrabold text-lg mt-2">{advice.riskLevel.replace('_', ' ')}</div>
            <div className="text-[11px] font-mono mt-1 opacity-90 line-clamp-1">{advice.cognitiveStatus}</div>
          </div>

          {/* Time to 0.00 BAC */}
          <div className="p-4 rounded-2xl glass-panel border border-cyan-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 uppercase">
              <span>Zero-BAC Recovery</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="font-orbitron font-bold text-2xl text-cyan-300 mt-1">
              ~{advice.timeToZeroHours} <span className="text-xs font-sans font-normal text-slate-400">hours</span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 mt-1">
              Full metabolic clearance estimated.
            </div>
          </div>

          {/* Hydration Action */}
          <div className="p-4 rounded-2xl glass-panel border border-emerald-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 uppercase">
              <span>Hydration Protocol</span>
              <Droplets className="w-4 h-4" />
            </div>
            <div className="text-xs font-sans text-emerald-200 mt-1 line-clamp-2">
              {advice.hydrationTip}
            </div>
            <button
              onClick={onLogWater}
              className="mt-2 py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-xs font-orbitron font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>LOG +300ML WATER</span>
            </button>
          </div>
        </div>
      )}

      {/* Actionable Recommendations */}
      {advice && advice.recommendations.length > 0 && (
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 space-y-3">
          <h3 className="text-xs font-orbitron font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" /> Actionable Neuro-Prescriptions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {advice.recommendations.map((rec, i) => (
              <div key={i} className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs font-mono text-purple-100 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 text-[10px] font-bold">
                  {i + 1}
                </span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive AI Telemetry Chat */}
      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-4">
        <h3 className="text-xs font-orbitron font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
          <Bot className="w-4 h-4 text-cyan-400" /> Interactive AI Telemetry Chat
        </h3>

        {/* Chat Messages Box */}
        <div className="h-48 overflow-y-auto custom-scrollbar p-3 rounded-xl bg-slate-950/70 border border-cyan-500/10 space-y-3 font-mono text-xs">
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-xl ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600/30 border border-cyan-400/40 text-cyan-100 rounded-br-none'
                    : 'bg-purple-950/50 border border-purple-500/30 text-purple-100 rounded-bl-none'
                }`}
              >
                <div className="text-[9px] text-slate-400 mb-1 uppercase font-bold">
                  {msg.sender === 'user' ? 'YOU' : 'LUMINA AI'}
                </div>
                <div>{msg.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input Form */}
        <form onSubmit={handleSendChat} className="flex items-center gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask Lumina e.g. 'Can I drive in 2 hours?' or 'How do I avoid hangover?'"
            className="flex-1 bg-slate-900/80 border border-cyan-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
          <button
            type="submit"
            disabled={isAsking || !chatInput.trim()}
            className="px-4 py-2.5 rounded-xl bg-purple-500/30 hover:bg-purple-500/40 border border-purple-400/40 text-purple-300 font-orbitron text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>ASK</span>
          </button>
        </form>
      </div>
    </div>
  );
};
