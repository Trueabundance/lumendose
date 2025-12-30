import type { FC } from 'react';
import { useState } from 'react';
import { Plus, Trash2, History, Droplet } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import type { Drink } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';

interface DrinkLoggerProps {
    onLogDrink: (drink: Omit<Drink, 'id'>) => void;
    drinks: Drink[];
    onDeleteDrink: (id: string) => void;
    onScanRequest: () => void;
}

export const DrinkLogger: FC<DrinkLoggerProps> = ({ onLogDrink, drinks, onDeleteDrink, onScanRequest }) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Quick Add Presets (simplified for now, can be expanded)
    const quickAdds = [
        { type: 'beer', volume: 568, abv: 4.5, label: "Pint of Beer" },
        { type: 'wine', volume: 175, abv: 13, label: "Large Wine" },
        { type: 'spirit', volume: 25, abv: 40, label: "Shot" },
    ];

    const handleQuickAdd = (qa: typeof quickAdds[0]) => {
        onLogDrink({
            type: qa.type,
            volume: qa.volume,
            abv: qa.abv,
            alcoholGrams: qa.volume * (qa.abv / 100) * 0.789,
            timestamp: new Date().toISOString()
        });
    };

    const ManualLogModal = () => {
        const [type, setType] = useState('beer');
        const [volume, setVolume] = useState(330);
        const [abv, setAbv] = useState(5);

        const handleSubmit = () => {
            onLogDrink({
                type,
                volume: Number(volume),
                abv: Number(abv),
                alcoholGrams: Number(volume) * (Number(abv) / 100) * 0.789,
                timestamp: new Date().toISOString()
            });
            setIsModalOpen(false);
        };

        return (
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('modal_title')}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">{t('modal_drink_type')}</label>
                        <select className="w-full bg-gray-700 rounded-lg p-3 text-white border border-gray-600" value={type} onChange={e => setType(e.target.value)}>
                            <option value="beer">Beer</option>
                            <option value="wine">Wine</option>
                            <option value="spirit">Spirit</option>
                            <option value="cocktail">Cocktail</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">{t('modal_volume')}</label>
                            <input type="number" className="w-full bg-gray-700 rounded-lg p-3 text-white border border-gray-600" value={volume} onChange={e => setVolume(Number(e.target.value))} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">{t('modal_abv')}</label>
                            <input type="number" className="w-full bg-gray-700 rounded-lg p-3 text-white border border-gray-600" value={abv} onChange={e => setAbv(Number(e.target.value))} />
                        </div>
                    </div>
                    <Button onClick={handleSubmit} className="w-full" size="lg">{t('modal_add_button')}</Button>
                </div>
            </Modal>
        );
    };

    return (
        <Card className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Droplet className="text-blue-400" />
                    {t('section_title_control')}
                </h3>
                <Button variant="ghost" size="sm" onClick={onScanRequest}>
                    Scan Label
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={18} />}>
                    {t('button_log_drink')}
                </Button>
                {quickAdds.map((qa, idx) => (
                    <Button key={idx} variant="secondary" size="sm" onClick={() => handleQuickAdd(qa)}>
                        {qa.label}
                    </Button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <h4 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                    <History size={14} /> Recent Log
                </h4>
                <div className="space-y-2">
                    {drinks.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-4">{t('log_empty')}</p>
                    ) : (
                        drinks.map(drink => (
                            <div key={drink.id} className="bg-gray-700/30 p-3 rounded-lg flex justify-between items-center group hover:bg-gray-700/50 transition-colors">
                                <div>
                                    <p className="font-semibold capitalize text-sm">{drink.type}</p>
                                    <p className="text-xs text-gray-400">{drink.volume}ml • {drink.abv}%</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-mono text-blue-300">{drink.alcoholGrams.toFixed(1)}g</span>
                                    <button
                                        onClick={() => drink.id && onDeleteDrink(drink.id)}
                                        className="text-gray-600 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <ManualLogModal />
        </Card>
    );
};
