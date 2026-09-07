import React, { useState } from 'react';
import { SciFiBackground } from './components/SciFiBackground';
import { Navbar } from './components/Navbar';
import { Modal } from './components/Modal';
import { TelemetryDashboard } from './features/TelemetryDashboard';
import { BrainVisual } from './features/BrainVisual';
import { DrinkLogger } from './features/DrinkLogger';
import { LabelScanner } from './features/LabelScanner';
import { AICoach } from './features/AICoach';
import { ApiKeyModal } from './features/ApiKeyModal';
import { Drink, DrinkType, UserProfile } from './types';
import { CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [drinks, setDrinks] = useState<Drink[]>(() => {
    // Initial sample session drink
    return [
      {
        id: '1',
        name: 'Craft Pilsner',
        type: 'beer',
        volumeMl: 355,
        abv: 5.0,
        standardDrinks: 1.0,
        timestamp: new Date(Date.now() - 45 * 60 * 1000) // 45 mins ago
      }
    ];
  });

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Operator',
    weightKg: 75,
    gender: 'male',
    targetBacLimit: 0.05
  });

  const [activeSection, setActiveSection] = useState<string>('telemetry');
  const [isScanOpen, setIsScanOpen] = useState<boolean>(false);
  const [isCoachOpen, setIsCoachOpen] = useState<boolean>(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('LUMENDOSE_API_KEY') || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute Widmark Estimated BAC
  const computeBac = (): number => {
    if (drinks.length === 0) return 0.0;

    let totalGrams = 0;
    const now = Date.now();
    const r = userProfile.gender === 'male' ? 0.68 : 0.55;
    const bodyWeightGrams = userProfile.weightKg * 1000;

    // Sum alcohol intake with time decay
    drinks.forEach(d => {
      const ethGrams = d.volumeMl * (d.abv / 100) * 0.789;
      const hoursPassed = (now - d.timestamp.getTime()) / (1000 * 60 * 60);
      
      // Widmark formula: BAC = (Grams / (Weight * r)) * 100 - (0.015 * Hours)
      const rawBacContrib = ((ethGrams) / (bodyWeightGrams * r)) * 100;
      const decayedContrib = Math.max(0, rawBacContrib - (0.015 * hoursPassed));
      totalGrams += decayedContrib;
    });

    return Number(totalGrams.toFixed(3));
  };

  const bacEstimate = computeBac();

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddDrink = (name: string, abv: number, volumeMl: number, type: DrinkType) => {
    const stdDrinks = Number(((volumeMl * (abv / 100)) / 17.7).toFixed(1));
    const newDrink: Drink = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      abv,
      volumeMl,
      type,
      standardDrinks: stdDrinks > 0 ? stdDrinks : 1.0,
      timestamp: new Date()
    };

    setDrinks(prev => [newDrink, ...prev]);
    triggerToast(`Logged ${name} (${abv}% ABV)`);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
  };

  const handleRemoveDrink = (id: string) => {
    setDrinks(prev => prev.filter(d => d.id !== id));
    triggerToast('Drink entry removed from telemetry log.');
  };

  const handleLogWater = () => {
    triggerToast('Hydration logged: +300ml water ingested.');
    confetti({ particleCount: 20, spread: 40, colors: ['#00f3ff', '#3b82f6'] });
  };

  const handleResetSession = () => {
    if (window.confirm('Reset current session telemetry and clear logged beverages?')) {
      setDrinks([]);
      triggerToast('Telemetry reset to 0.00% BAC baseline.');
    }
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('LUMENDOSE_API_KEY', key);
    triggerToast('Gemini API key configuration saved.');
  };

  return (
    <div className="min-w-[320px] min-h-screen flex flex-col relative bg-[#050814] text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Sci-Fi Canvas Background */}
      <SciFiBackground />

      {/* Futuristic Navbar */}
      <Navbar
        bacEstimate={bacEstimate}
        onOpenScan={() => setIsScanOpen(true)}
        onOpenCoach={() => setIsCoachOpen(true)}
        onOpenApiKey={() => setIsApiKeyOpen(true)}
        onResetSession={handleResetSession}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 z-10 space-y-8">
        {/* Navigation Tabs (Mobile View) */}
        <div className="flex md:hidden items-center justify-around glass-panel p-2 rounded-xl border border-cyan-500/20 font-orbitron text-xs">
          <button
            onClick={() => setActiveSection('telemetry')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'telemetry' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400'
            }`}
          >
            TELEMETRY
          </button>
          <button
            onClick={() => setActiveSection('brain')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'brain' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400'
            }`}
          >
            NEURAL MAP
          </button>
          <button
            onClick={() => setActiveSection('logger')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'logger' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400'
            }`}
          >
            DOSE LOG
          </button>
        </div>

        {/* Section Router */}
        {activeSection === 'telemetry' && (
          <TelemetryDashboard
            drinks={drinks}
            bacEstimate={bacEstimate}
            userWeightKg={userProfile.weightKg}
            onOpenScan={() => setIsScanOpen(true)}
            onOpenCoach={() => setIsCoachOpen(true)}
          />
        )}

        {activeSection === 'brain' && (
          <BrainVisual bacEstimate={bacEstimate} />
        )}

        {activeSection === 'logger' && (
          <DrinkLogger
            drinks={drinks}
            onAddDrink={handleAddDrink}
            onRemoveDrink={handleRemoveDrink}
            onLogWater={handleLogWater}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="z-10 border-t border-cyan-500/20 glass-panel px-4 sm:px-8 py-4 text-center font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>LUMENDOSE NEURO-BIOMETRIC TELEMETRY ENGINE • v2.0</span>
          <span>Educational & Personal Monitoring System. Always consume responsibly.</span>
        </div>
      </footer>

      {/* SCAN LABEL MODAL (Centered Responsive Dialog) */}
      <Modal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        maxWidth="max-w-xl"
      >
        <LabelScanner
          onAddDrink={handleAddDrink}
          apiKey={apiKey}
          onClose={() => setIsScanOpen(false)}
        />
      </Modal>

      {/* AI COACH MODAL (Centered Responsive Dialog) */}
      <Modal
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
        maxWidth="max-w-3xl"
      >
        <AICoach
          drinks={drinks}
          bacEstimate={bacEstimate}
          userWeightKg={userProfile.weightKg}
          apiKey={apiKey}
          onLogWater={handleLogWater}
        />
      </Modal>

      {/* API KEY SETTINGS MODAL */}
      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl glass-panel-glow border border-cyan-400 text-cyan-200 font-mono text-xs shadow-neon-cyan flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
