import { type FC, useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Lock } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import type { Drink } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PremiumDashboardProps {
    isPremium: boolean;
    onUpgrade: () => void;
    drinks: Drink[];
}

export const PremiumDashboard: FC<PremiumDashboardProps> = ({ isPremium, onUpgrade, drinks }) => {
    const { t } = useTranslation();
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        if (!isPremium) return;

        // Aggregate drinks by date for the chart
        const data: { [key: string]: number } = {};
        // Get last 7 days
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            data[key] = 0; // init
        }

        drinks.forEach(d => {
            const dateKey = d.timestamp.split('T')[0];
            if (data[dateKey] !== undefined) {
                data[dateKey] += d.alcoholGrams;
            }
        });

        const formatted = Object.entries(data).map(([date, grams]) => ({
            date: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
            grams: Number(grams.toFixed(1))
        }));

        setChartData(formatted);
    }, [isPremium, drinks]);

    if (!isPremium) {
        return (
            <Card className="relative overflow-hidden border-yellow-500/30">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/10 to-transparent pointer-events-none" />
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="text-yellow-400" />
                        {t('section_title_premium')}
                    </h3>
                    <Lock className="text-yellow-500/50" />
                </div>
                <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3 opacity-60">
                        <BarChart3 className="mt-1" size={16} />
                        <div>
                            <p className="font-bold text-sm">Historical Trends</p>
                            <p className="text-xs">Track consumption over time.</p>
                        </div>
                    </div>
                </div>
                <Button variant="premium" onClick={onUpgrade} className="w-full">
                    {t('premium_modal_button')}
                </Button>
            </Card>
        );
    }

    return (
        <Card className="bg-gray-800/50">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="text-purple-400" />
                {t('premium_dashboard_title')}
            </h3>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: '1px solid #374151',
                                borderRadius: '0.5rem'
                            }}
                        />
                        <Bar dataKey="grams" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-center text-xs text-gray-500 mt-4">Alcohol (grams) per day (Last 7 Days)</p>
        </Card>
    );
};
