import { type FC, useState, useEffect, useCallback } from 'react';
import type { Drink, Analysis } from '../types';
import { useTranslation } from '../context/LanguageContext';
import { Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { generateGeminiInsight } from '../services/gemini';
import { brainRegionsData } from '../utils/brainData';
import { Card } from '../components/Card';
import { AnimatePresence, motion } from 'framer-motion';

interface AICoachProps {
    drinks: Drink[];
    analysis: Analysis | null;
    dailyAlcoholGoal: number | null;
}

export const AICoach: FC<AICoachProps> = ({ drinks, analysis, dailyAlcoholGoal }) => {
    const { t } = useTranslation();
    const [insight, setInsight] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(true);

    const generateInsight = useCallback(async () => {
        if (!drinks || drinks.length < 1 || !analysis) return;
        setIsLoading(true);
        setError(null);
        setInsight('');
        console.log("AI Coach: Generating insight...", { drinksCount: drinks.length, analysisKeys: Object.keys(analysis) });

        const sessionSummary = drinks.map(d => `${d.volume}ml of ${d.type} at ${d.abv}% ABV`).join(', ');
        if (!analysis || Object.keys(analysis).length === 0) return;
        const totalGrams = drinks.reduce((sum, d) => sum + d.alcoholGrams, 0).toFixed(1);

        const analysisValues = Object.values(analysis);
        const highestImpactRegion = analysisValues.length > 0
            ? analysisValues.sort((a, b) => b.impact - a.impact)[0]
            : null;

        if (!highestImpactRegion) {
            console.warn("AI Coach: No impact region data found.");
            return;
        }

        const highestImpactRegionData = Object.values(brainRegionsData).find(r => r.name === highestImpactRegion.name);

        const firstDrinkTime = new Date(drinks[drinks.length - 1].timestamp);
        const lastDrinkTime = new Date(drinks[0].timestamp);
        const sessionDurationMinutes = (lastDrinkTime.getTime() - firstDrinkTime.getTime()) / (1000 * 60);
        const drinksPerHour = drinks.length > 1 && sessionDurationMinutes > 0 ? (drinks.length / (sessionDurationMinutes / 60)) : drinks.length;

        let pacingContext = `The user has had ${drinks.length} drinks over ${sessionDurationMinutes.toFixed(0)} minutes.`;
        pacingContext += drinksPerHour > 2 ? " This is a rapid pace." : " This is a moderate pace.";

        let goalContext = "";
        if (dailyAlcoholGoal !== null && dailyAlcoholGoal > 0) {
            const currentGrams = parseFloat(totalGrams);
            if (currentGrams > dailyAlcoholGoal) {
                goalContext = `They have exceeded their daily goal of ${dailyAlcoholGoal}g by ${(currentGrams - dailyAlcoholGoal).toFixed(1)}g.`;
            } else {
                goalContext = `They are currently at ${currentGrams}g towards their daily goal of ${dailyAlcoholGoal}g.`;
            }
        }

        const prompt = `As an expert on the science of alcohol's effects, you are an AI Coach for the app LumenDose. 
        User Data:
        - Drinks: ${sessionSummary}
        - Total Alcohol: ${totalGrams}g
        - Pacing: ${pacingContext}
        - Highest Impact: ${t(highestImpactRegion.name)} affecting ${highestImpactRegionData?.functions}
        - Goal Status: ${goalContext}

        Task: Provide a single, concise, actionable, and non-judgmental insight (20-30 words). 
        Focus on specific suggestions (pacing, hydration, food, etc.). 
        Avoid generic "drink responsibly". Be encouraging.`;

        try {
            const result = await generateGeminiInsight(prompt);
            if (result) {
                setInsight(result);
            } else {
                throw new Error("No insight generated");
            }
        } catch (err: any) {
            console.error("AI Coach Error:", err);
            setError(err.message === "Gemini API Key is missing."
                ? t('ai_coach_no_key')
                : "Could not connect to AI Coach.");
        } finally {
            setIsLoading(false);
        }
    }, [drinks, analysis, t, dailyAlcoholGoal]);

    useEffect(() => {
        if (drinks.length >= 1 && isVisible) {
            generateInsight();
        }
    }, [drinks.length, isVisible]); // Removed generateInsight from deps to avoid loops, though useCallback handles it.

    if (drinks.length < 1 || !isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                >
                    <Card className="mt-6 bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-500/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            <button onClick={() => setIsVisible(false)} className="text-blue-300/50 hover:text-white transition-colors">
                                <span className="sr-only">Close</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-blue-500/20 p-3 rounded-xl">
                                <Sparkles className="text-blue-400" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    {t('ai_coach_title')}
                                </h3>

                                {isLoading ? (
                                    <div className="flex items-center gap-2 text-blue-200/70">
                                        <Loader2 className="animate-spin" size={16} />
                                        <span>{t('ai_coach_generating')}</span>
                                    </div>
                                ) : error ? (
                                    <div className="flex items-center gap-2 text-yellow-400/90 text-sm bg-yellow-900/20 p-2 rounded-lg">
                                        <AlertTriangle size={16} />
                                        <p>{error}</p>
                                    </div>
                                ) : (
                                    <p className="text-blue-100 leading-relaxed font-medium">
                                        {insight}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
