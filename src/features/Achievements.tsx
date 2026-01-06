import { type FC } from 'react';
import { Card } from '../components/Card';
import { Award, Trophy, Target, Calendar } from 'lucide-react';

export const Achievements: FC<{ drinksCount: number }> = ({ drinksCount }) => {
    const achievements = [
        {
            id: 'first_log',
            title: 'First Step',
            description: 'Log your first drink',
            icon: <Target className="text-blue-400" size={24} />,
            condition: drinksCount >= 1,
        },
        {
            id: 'consistent_tracker',
            title: 'Tracker',
            description: 'Log 10 drinks total',
            icon: <Calendar className="text-purple-400" size={24} />,
            condition: drinksCount >= 10,
        },
        {
            id: 'mindful_master',
            title: 'Mindful Master',
            description: 'Log 50 drinks',
            icon: <Trophy className="text-yellow-400" size={24} />,
            condition: drinksCount >= 50,
        },
    ];

    return (
        <Card className="p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Award className="text-yellow-500" /> Achievements
            </h3>
            <div className="space-y-4">
                {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${achievement.condition
                                ? 'bg-gray-800/80 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
                                : 'bg-gray-900/40 border-gray-700 opacity-50 grayscale'
                            }`}
                    >
                        <div className={`p-3 rounded-full ${achievement.condition ? 'bg-gray-700' : 'bg-gray-800'}`}>
                            {achievement.icon}
                        </div>
                        <div>
                            <h4 className={`font-bold ${achievement.condition ? 'text-white' : 'text-gray-500'}`}>
                                {achievement.title}
                            </h4>
                            <p className="text-sm text-gray-400">{achievement.description}</p>
                        </div>
                        {achievement.condition && (
                            <div className="ml-auto">
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-bold uppercase">
                                    Unlocked
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};
