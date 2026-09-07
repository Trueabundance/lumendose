import React, { useState } from 'react';
import { Drink, DrinkType } from '../types';
import { Plus, Trash2, Beer, Wine, Flame, Sparkles, Droplets, Zap } from 'lucide-react';

interface DrinkLoggerProps {
  drinks: Drink[];
  onAddDrink: (name: string, abv: number, volumeMl: number, type: DrinkType) => void;
  onRemoveDrink: (id: string) => void;
  onLogWater: () => void;
}

const PRESET_DRINKS = [
  { name: 'Standard Beer', type: 'beer' as const, abv: 5.0, volumeMl: 355, icon: Beer, color: 'text-amber-400 border-amber-500/40 bg-amber-950/30' },
  { name: 'Pint Craft IPA', type: 'beer' as const, abv: 6.8, volumeMl: 473, icon: Beer, color: 'text-amber-300 border-amber-500/40 bg-amber-950/30' },
  { name: 'Red / White Wine', type: 'wine' as const, abv: 12.5, volumeMl: 150, icon: Wine, color: 'text-rose-400 border-rose-500/40 bg-rose-950/30' },
  { name: 'Whiskey / Vodka Shot', type: 'shot' as const, abv: 40.0, volumeMl: 45, icon: Flame, color: 'text-orange-400 border-orange-500/40 bg-orange-950/30' },
  { name: 'Craft Cocktail', type: 'cocktail' as const, abv: 15.0, volumeMl: 200, icon: Sparkles, color: 'text-purple-400 border-purple-500/40 bg-purple-950/30' }
];

export const DrinkLogger: React.FC<DrinkLoggerProps> = ({
  drinks,
  onAddDrink,
  onRemoveDrink,
  onLogWater
}) => {
  const [customName, setCustomName] = useState<string>('');
  const [customAbv, setCustomAbv] = useState<number>(5.0);
  const [customVolume, setCustomVolume] = useState<number>(355);
  const [customType, setCustomType] = useState<DrinkType>('custom');

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDrink(
      customName.trim() || 'Custom Beverage',
      customAbv,
      customVolume,
      customType
    );
    setCustomName('');
  };

  const calculateEthGrams = (volumeMl: number, abv: number) => {
    // ethanol density = ~0.789 g/ml
    return Math.round(volumeMl * (abv / 100) * 0.789);
  };

  return (
    <div className="space-y-6">
      {/* Quick Add Presets */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-orbitron font-bold text-lg text-cyan-300 text-glow-cyan flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" /> QUICK DOSE PRESETS
          </h3>
          <span className="text-xs font-mono text-cyan-400/70">1-CLICK LOGGING</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PRESET_DRINKS.map((preset, idx) => {
            const Icon = preset.icon;
            const ethGrams = calculateEthGrams(preset.volumeMl, preset.abv);
            const stdDrinks = ((preset.volumeMl * (preset.abv / 100)) / 17.7).toFixed(1);

            return (
              <button
                key={idx}
                onClick={() => onAddDrink(preset.name, preset.abv, preset.volumeMl, preset.type)}
                className={`p-4 rounded-xl border transition-all hover:scale-105 flex flex-col items-center text-center cursor-pointer ${preset.color}`}
              >
                <Icon className="w-6 h-6 mb-2" />
                <div className="font-orbitron font-bold text-xs text-white line-clamp-1">{preset.name}</div>
                <div className="text-[10px] font-mono text-slate-300 mt-1">
                  {preset.volumeMl}ml • {preset.abv}% ABV
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 border border-white/10 text-cyan-300">
                  {stdDrinks} Std ({ethGrams}g pure alc)
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Drink Creator Form */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-cyan-500/30 space-y-4">
        <h3 className="font-orbitron font-bold text-base text-cyan-300 uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4 text-cyan-400" /> CUSTOM BEVERAGE FORMULATION
        </h3>

        <form onSubmit={handleCustomAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-mono text-cyan-400/80 mb-1">Beverage Name</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Imperial Stout, Margarita"
              className="w-full bg-slate-900/80 border border-cyan-500/30 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-cyan-400/80 mb-1">
              Alcohol by Volume (ABV): <span className="font-bold text-cyan-300">{customAbv}%</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="70"
              step="0.5"
              value={customAbv}
              onChange={(e) => setCustomAbv(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-cyan-400/80 mb-1">
              Volume (ml): <span className="font-bold text-cyan-300">{customVolume} ml</span>
            </label>
            <input
              type="range"
              min="25"
              max="1000"
              step="25"
              value={customVolume}
              onChange={(e) => setCustomVolume(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 shadow-neon-cyan font-orbitron font-bold text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>LOG BEVERAGE</span>
          </button>
        </form>
      </div>

      {/* Active Session Log */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-orbitron font-bold text-base text-cyan-300 uppercase tracking-wider">
            ACTIVE SESSION LOG ({drinks.length} ENTRIES)
          </h3>
          <button
            onClick={onLogWater}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>+300ML WATER</span>
          </button>
        </div>

        {drinks.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-cyan-500/20 rounded-xl text-slate-500 font-mono text-xs">
            No beverages logged in current session. Select a preset above or scan a label to initiate telemetry.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
            {drinks.map((drink) => (
              <div
                key={drink.id}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 flex items-center justify-between gap-3 font-mono text-xs hover:border-cyan-400/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    <Beer className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{drink.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {drink.volumeMl}ml @ {drink.abv}% ABV • {drink.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-cyan-300 font-bold">{drink.standardDrinks} Std</div>
                    <div className="text-[10px] text-slate-400">
                      {calculateEthGrams(drink.volumeMl, drink.abv)}g pure alc
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveDrink(drink.id)}
                    className="p-2 rounded-lg hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 border border-transparent hover:border-rose-500/40 transition-all cursor-pointer"
                    title="Remove Drink"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
