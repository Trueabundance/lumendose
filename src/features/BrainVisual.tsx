import React, { useState } from 'react';
import { BrainRegion } from '../types';
import { Modal } from '../components/Modal';
import { Brain, Info, Zap, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';

interface BrainVisualProps {
  bacEstimate: number;
}

const BRAIN_REGIONS: BrainRegion[] = [
  {
    id: 'prefrontal',
    name: 'Prefrontal Cortex',
    medicalName: 'Pars Orbitalis & Frontal Lobe',
    role: 'Executive Function, Decision Making & Inhibitions',
    bacThreshold: 0.02,
    sciFiDescription: 'The central executive matrix governing logical reasoning, long-term decision calculation, and social impulse gating.',
    neurotransmitterEffect: 'GABA-A receptor potentiation slows neuronal firing frequency; NMDA glutamate transmission suppressed by 25%.',
    behavioralSymptom: 'Reduced social anxiety, heightened risk tolerance, diminished self-monitoring capacity.',
    location: { x: 120, y: 150, path: 'M 90 120 C 130 90, 190 90, 210 130 C 210 170, 160 210, 110 190 C 80 175, 75 140, 90 120 Z' }
  },
  {
    id: 'motor',
    name: 'Primary Motor Cortex',
    medicalName: 'Precentral Gyrus',
    role: 'Fine Motor Control, Dexterity & Reaction Time',
    bacThreshold: 0.04,
    sciFiDescription: 'Biomechanical actuation grid translating cognitive movement intentions into muscular contractions.',
    neurotransmitterEffect: 'Dampened signal propagation along pyramidal tracts; neuromuscular latency increases by 40-120ms.',
    behavioralSymptom: 'Mild hand tremor, delayed braking reaction, slight loss of precision manual dexterity.',
    location: { x: 230, y: 110, path: 'M 215 120 C 230 80, 290 80, 310 120 C 310 160, 260 180, 220 160 Z' }
  },
  {
    id: 'limbic',
    name: 'Limbic System & Amygdala',
    medicalName: 'Corpus Striatum & Amygdaloid Complex',
    role: 'Emotional Processing, Pleasure & Mood Regulation',
    bacThreshold: 0.03,
    sciFiDescription: 'Emotional telemetry hub controlling mood amplification, euphoria feedback loops, and fear detection.',
    neurotransmitterEffect: 'Dopamine release surges in nucleus accumbens by 150%; serotonin recycling temporarily delayed.',
    behavioralSymptom: 'Elevated euphoria, magnified emotional volatility, amplified response to ambient stimuli.',
    location: { x: 220, y: 200, path: 'M 180 180 C 220 160, 270 170, 270 220 C 250 250, 190 240, 180 180 Z' }
  },
  {
    id: 'hippocampus',
    name: 'Hippocampus',
    medicalName: 'Hippocampal Formation',
    role: 'Memory Encoding & Information Retrieval',
    bacThreshold: 0.07,
    sciFiDescription: 'Long-term synaptic buffer responsible for transferring working memory frames into permanent neural storage.',
    neurotransmitterEffect: 'Long-Term Potentiation (LTP) completely blocked via NMDA channel blockade.',
    behavioralSymptom: 'Fragmented short-term recall; potential anterograde blackout episodes above 0.12% BAC.',
    location: { x: 280, y: 220, path: 'M 250 210 C 300 200, 330 230, 310 260 C 270 270, 240 240, 250 210 Z' }
  },
  {
    id: 'cerebellum',
    name: 'Cerebellum',
    medicalName: 'Cerebellar Hemispheres',
    role: 'Balance, Equilibrium & Articulation',
    bacThreshold: 0.06,
    sciFiDescription: 'Gyroscopic stabilization processor coordinating vestibular balance signals and speech motor articulation.',
    neurotransmitterEffect: 'Purkinje cell inhibition in cerebellar cortex disrupts real-time balance error correction.',
    behavioralSymptom: 'Unsteady stance, staggered gait (ataxia), slurred vocal articulation, dysmetria.',
    location: { x: 300, y: 280, path: 'M 300 250 C 360 240, 400 280, 380 330 C 330 350, 290 310, 300 250 Z' }
  },
  {
    id: 'visual',
    name: 'Visual Cortex',
    medicalName: 'Occipital Lobe',
    role: 'Visual Processing & Depth Perception',
    bacThreshold: 0.08,
    sciFiDescription: 'Primary optical sensor processing unit converting retinal photon streams into spatial depth maps.',
    neurotransmitterEffect: 'Suppression of lateral inhibition in visual cortex degrades contrast sensitivity and smooth pursuit tracking.',
    behavioralSymptom: 'Tunnel vision, reduced peripheral awareness, slow eye convergence, diplopia (double vision).',
    location: { x: 370, y: 180, path: 'M 320 140 C 380 140, 420 190, 400 240 C 350 250, 310 200, 320 140 Z' }
  }
];

export const BrainVisual: React.FC<BrainVisualProps> = ({ bacEstimate }) => {
  const [selectedRegion, setSelectedRegion] = useState<BrainRegion | null>(null);

  const getRegionStatus = (region: BrainRegion) => {
    if (bacEstimate === 0) return { level: 'Normal', color: '#10b981', bgClass: 'border-emerald-500/30 text-emerald-400', stroke: '#10b981' };
    const ratio = bacEstimate / region.bacThreshold;
    if (ratio < 0.8) return { level: 'Nominal', color: '#00f3ff', bgClass: 'border-cyan-500/30 text-cyan-300', stroke: '#00f3ff' };
    if (ratio < 1.5) return { level: 'Mild Impact', color: '#3b82f6', bgClass: 'border-blue-500/40 text-blue-300', stroke: '#3b82f6' };
    if (ratio < 2.5) return { level: 'Moderate Suppression', color: '#f59e0b', bgClass: 'border-amber-500/40 text-amber-300', stroke: '#f59e0b' };
    return { level: 'Severe Disruption', color: '#f43f5e', bgClass: 'border-rose-500/40 text-rose-300', stroke: '#f43f5e' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/30">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-400/40 text-cyan-300 shadow-neon-cyan">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-cyan-300 text-glow-cyan">
                NEURAL IMPACT MAP
              </h2>
              <p className="text-xs font-mono text-cyan-400/80">
                Interactive 3D Cortex Telemetry • Est. BAC: <span className="font-bold text-white">{bacEstimate.toFixed(3)}%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Nominal
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Mild
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Moderate
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-400" /> Severe
          </span>
        </div>
      </div>

      {/* Main SVG Cortex Diagram */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col items-center justify-center relative overflow-hidden">
        <p className="text-xs font-mono text-cyan-400/60 mb-2 uppercase tracking-widest text-center">
          Click any neural zone below to inspect region telemetry
        </p>

        <div className="relative w-full max-w-xl aspect-[4/3] flex items-center justify-center">
          <svg
            viewBox="0 0 500 400"
            className="w-full h-full filter drop-shadow-[0_0_15px_rgba(0,243,255,0.2)]"
          >
            {/* Brain Outline Background */}
            <path
              d="M 80 200 C 60 110, 160 50, 260 50 C 380 50, 450 110, 440 200 C 440 270, 390 340, 300 350 C 220 360, 170 300, 140 280 C 110 270, 80 240, 80 200 Z"
              fill="rgba(8, 14, 30, 0.85)"
              stroke="rgba(0, 243, 255, 0.2)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Synaptic Wireframe Grid */}
            <g opacity="0.25">
              <circle cx="250" cy="200" r="120" fill="none" stroke="#00f3ff" strokeWidth="0.5" />
              <circle cx="250" cy="200" r="70" fill="none" stroke="#00f3ff" strokeWidth="0.5" />
              <line x1="130" y1="200" x2="370" y2="200" stroke="#00f3ff" strokeWidth="0.5" />
              <line x1="250" y1="80" x2="250" y2="320" stroke="#00f3ff" strokeWidth="0.5" />
            </g>

            {/* Render Interactive Regions */}
            {BRAIN_REGIONS.map((region) => {
              const status = getRegionStatus(region);
              const isSelected = selectedRegion?.id === region.id;

              return (
                <g key={region.id} className="cursor-pointer group" onClick={() => setSelectedRegion(region)}>
                  <path
                    d={region.location.path}
                    fill={status.color}
                    fillOpacity={isSelected ? '0.6' : '0.25'}
                    stroke={status.color}
                    strokeWidth={isSelected ? '3' : '1.5'}
                    className="transition-all duration-300 group-hover:fill-opacity-50 group-hover:stroke-white"
                  />
                  {/* Region Label */}
                  <text
                    x={region.location.x}
                    y={region.location.y}
                    fill="#ffffff"
                    fontSize="11"
                    fontFamily="Orbitron, sans-serif"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                  >
                    {region.name.split(' ')[0]}
                  </text>
                  <circle
                    cx={region.location.x}
                    cy={region.location.y + 12}
                    r="4"
                    fill={status.color}
                    className="animate-pulse"
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Region Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {BRAIN_REGIONS.map((region) => {
          const status = getRegionStatus(region);
          return (
            <div
              key={region.id}
              onClick={() => setSelectedRegion(region)}
              className={`glass-panel p-5 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between ${status.bgClass} hover:border-cyan-400`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-orbitron font-bold text-sm text-white">
                    {region.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-current">
                    {status.level}
                  </span>
                </div>
                <p className="text-xs font-sans text-slate-300 line-clamp-2 mb-3">
                  {region.sciFiDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Trigger BAC: {region.bacThreshold}%</span>
                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
                  DETAILS <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Centered Modal Card Description */}
      {selectedRegion && (
        <Modal
          isOpen={!!selectedRegion}
          onClose={() => setSelectedRegion(null)}
          title={selectedRegion.name}
          subtitle={`CORTEX SCAN TELEMETRY • ${selectedRegion.medicalName.toUpperCase()}`}
        >
          <div className="space-y-5">
            {/* Status Banner */}
            {(() => {
              const status = getRegionStatus(selectedRegion);
              return (
                <div className={`p-4 rounded-xl border flex items-center justify-between ${status.bgClass} bg-slate-900/60`}>
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5" />
                    <div>
                      <div className="text-xs font-mono uppercase text-slate-400">Current Impact Level</div>
                      <div className="font-orbitron font-bold text-base">{status.level}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <div className="text-slate-400">BAC Threshold</div>
                    <div className="font-bold text-white">{selectedRegion.bacThreshold}% BAC</div>
                  </div>
                </div>
              );
            })()}

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-orbitron font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4" /> Neural Function & Overview
              </h4>
              <p className="text-sm font-sans text-slate-200 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-cyan-500/10">
                {selectedRegion.sciFiDescription}
              </p>
            </div>

            {/* Neurotransmitter Dynamics */}
            <div className="space-y-2">
              <h4 className="text-xs font-orbitron font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4" /> Synaptic & Neurotransmitter Dynamics
              </h4>
              <p className="text-xs font-mono text-purple-200 leading-relaxed bg-purple-950/30 p-3.5 rounded-xl border border-purple-500/20">
                {selectedRegion.neurotransmitterEffect}
              </p>
            </div>

            {/* Behavioral Symptoms */}
            <div className="space-y-2">
              <h4 className="text-xs font-orbitron font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Behavioral & Motor Manifestations
              </h4>
              <p className="text-xs font-sans text-amber-100 leading-relaxed bg-amber-950/30 p-3.5 rounded-xl border border-amber-500/20">
                {selectedRegion.behavioralSymptom}
              </p>
            </div>

            {/* Recommendations */}
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-2">
              <div className="text-xs font-orbitron font-bold text-cyan-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Biometric Recovery Recommendation
              </div>
              <p className="text-xs font-mono text-cyan-200">
                Maintain hydration with electrolyte-fortified water to assist hepatic ethanol processing and prevent glial cell dehydration.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
