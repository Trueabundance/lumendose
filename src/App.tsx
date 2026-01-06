import { useState, useMemo, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useDrinks } from './hooks/useDrinks';
import { useTranslation, LanguageProvider } from './context/LanguageContext';
import { AuthScreen } from './features/AuthScreen';
import { SplashScreen } from './components/SplashScreen';
import { BrainVisual } from './features/BrainVisual';
import { AICoach } from './features/AICoach';
import { DrinkLogger } from './features/DrinkLogger';
import { PremiumDashboard } from './features/PremiumDashboard';
import { CameraScanModal } from './features/CameraScanModal';
import { analyzeConsumption } from './utils/analysis';
import { Brain, LogOut, Loader2 } from 'lucide-react';
import { Button } from './components/Button';
import { LanguageSelector } from './components/LanguageSelector';
import { Achievements } from './features/Achievements';

function Dashboard() {
  const { user, logout } = useAuth();
  const { drinks, loading: drinksLoading, addDrink, deleteDrink } = useDrinks(user?.uid || null);
  const { t } = useTranslation();
  const [isPremium, setIsPremium] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // Derived state
  const analysis = useMemo(() => analyzeConsumption(drinks, t), [drinks, t]);
  const totalAlcohol = drinks.reduce((sum, d) => sum + d.alcoholGrams, 0).toFixed(1);

  const handleScanSuccess = (data: any) => {
    if (data.type && data.volume && data.abv) {
      addDrink({
        type: data.type.toLowerCase(),
        volume: Number(data.volume),
        abv: Number(data.abv),
        alcoholGrams: Number(data.volume) * (Number(data.abv) / 100) * 0.789,
        timestamp: new Date().toISOString()
      });
    }
  };

  if (drinksLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-purple-500/30">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <Brain className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text hidden sm:block">
              LumenDose
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right mr-2">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Total Intake</p>
              <p className="text-xl font-bold text-blue-400 leading-none">{totalAlcohol}<span className="text-sm text-gray-500">g</span></p>
            </div>

            {!isPremium && (
              <Button
                variant="premium"
                size="sm"
                onClick={() => setIsPremium(true)}
                className="hidden sm:flex"
              >
                {t('header_premium_button')}
              </Button>
            )}

            <LanguageSelector />

            <Button variant="ghost" size="sm" onClick={logout} icon={<LogOut size={18} />}>
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Visualization & Insights (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-gray-800/30 rounded-3xl p-6 border border-white/5 relative overflow-hidden min-h-[500px] flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="mb-6 relative z-10">
              <h2 className="text-2xl font-bold text-white mb-1">{t('section_title_impact')}</h2>
              <p className="text-gray-400 text-sm">{t('section_subtitle_impact')}</p>
            </div>

            <div className="flex-1 flex items-center justify-center relative z-10">
              <BrainVisual analysis={analysis} showCards={drinks.length > 0} />
            </div>
          </section>

          <AICoach drinks={drinks} analysis={analysis} dailyAlcoholGoal={null} />
        </div>

        {/* Right Column: Controls & Stats (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <DrinkLogger
            drinks={drinks}
            onLogDrink={addDrink}
            onDeleteDrink={deleteDrink}
            onScanRequest={() => setShowCamera(true)}
          />

          <PremiumDashboard
            isPremium={isPremium}
            drinks={drinks}
            onUpgrade={() => setIsPremium(true)}
          />

          <Achievements drinksCount={drinks.length} />
        </div>
      </main>

      <CameraScanModal
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
}


function AppContent() {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Keep splash screen for at least 2.5 seconds or until auth loads
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Show splash if we're enforcing the timer OR if auth is still initialising
  if (showSplash || loading) {
    return <SplashScreen />;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
