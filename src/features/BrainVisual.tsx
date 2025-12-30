import { type FC, useState, cloneElement, type ReactElement } from 'react';
import type { Analysis, BrainRegionAnalysis } from '../types';
import { useTranslation } from '../context/LanguageContext';
import { Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { brainRegionsData } from '../utils/brainData';
import { Modal } from '../components/Modal';

// Separate Card Modal Component
const RegionDetailModal: FC<{ isOpen: boolean; onClose: () => void; cardData: BrainRegionAnalysis | null; }> = ({ isOpen, onClose, cardData }) => {
    const { t } = useTranslation();
    if (!cardData) return null;

    const impactLevel = cardData.impactWord.toLowerCase();
    let impactColorClass = 'bg-gray-700';
    if (impactLevel === 'low') {
        impactColorClass = 'bg-green-800/50 border-green-500 text-green-400';
    } else if (impactLevel === 'moderate') {
        impactColorClass = 'bg-yellow-800/50 border-yellow-500 text-yellow-400';
    } else if (impactLevel === 'high') {
        impactColorClass = 'bg-red-800/50 border-red-500 text-red-500';
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t(cardData.name)} className={`border-2 ${impactColorClass.split(' ')[1]} shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
            <div className="flex flex-col items-center mb-6">
                <div className={`p-4 rounded-full bg-gray-900 border-2 ${impactColorClass.split(' ')[1]} mb-4`}>
                    {cloneElement(cardData.icon as ReactElement<any>, { className: impactColorClass.split(' ')[2], size: 48 })}
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${impactColorClass.replace('text-', 'bg-').replace('-400', '-500/20').replace('-500', '-500/20')} ${impactColorClass.split(' ')[2]}`}>
                    {cardData.impactWord} Impact
                </span>
            </div>
            <p className="text-xl text-center text-gray-200 font-medium mb-4">{cardData.effectText}</p>
            <div className="bg-gray-900/50 p-4 rounded-xl border border-white/5">
                <h4 className="text-sm uppercase text-gray-500 font-bold mb-2">Function</h4>
                <p className="text-sm text-gray-300">{brainRegionsData[cardData.name.replace('region_', '')]?.functions}</p>
            </div>
        </Modal>
    );
};

interface BrainVisualProps {
    analysis: Analysis | null;
    showCards: boolean;
}

export const BrainVisual: FC<BrainVisualProps> = ({ analysis, showCards }) => {
    const { t } = useTranslation();
    const [selectedCard, setSelectedCard] = useState<BrainRegionAnalysis | null>(null);

    if (!analysis) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] bg-gray-800/30 rounded-2xl border border-dashed border-gray-700">
                <Zap className="text-gray-600 mb-4" size={48} />
                <p className="text-gray-400 font-medium">Scan a drink or log manually to see brain impact!</p>
            </div>
        );
    }

    const cards = Object.values(analysis);

    return (
        <>
            <div className="h-[400px] w-full relative perspective-1000 flex items-center justify-center">
                <AnimatePresence>
                    {showCards && cards.map((card, index) => {
                        const impactLevel = card.impactWord.toLowerCase();
                        let borderColor = 'border-gray-600';
                        if (impactLevel === 'low') borderColor = 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]';
                        else if (impactLevel === 'moderate') borderColor = 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]';
                        else if (impactLevel === 'high') borderColor = 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]';

                        // Calculate positions for a fan effect
                        const rotate = (index - 2.5) * 10;
                        const tx = (index - 2.5) * 40;
                        const ty = Math.abs(index - 2.5) * 10;

                        return (
                            <motion.div
                                key={card.name}
                                initial={{ y: 200, opacity: 0, scale: 0.5, rotate: 0 }}
                                animate={{ y: ty, x: tx, opacity: 1, scale: 1, rotate: rotate }}
                                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                                whileHover={{ scale: 1.1, zIndex: 10, y: -20, rotate: 0 }}
                                onClick={() => setSelectedCard(card)}
                                className="absolute cursor-pointer w-36 h-56"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div className={`w-full h-full bg-gray-800 rounded-xl border-2 ${borderColor} flex flex-col justify-between p-3 relative overflow-hidden group`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                                    {/* Top Content */}
                                    <div className="flex flex-col items-center z-10">
                                        <span className="text-xs font-bold text-gray-300 uppercase tracking-wide mb-1">{t(card.name).split(' ')[0]}</span>
                                        {cloneElement(card.icon as ReactElement<any>, { className: "text-white/80", size: 16 })}
                                    </div>

                                    {/* Middle Icon */}
                                    <div className="absolute inset-0 flex items-center justify-center z-0 opacity-20 group-hover:opacity-40 transition-opacity">
                                        {cloneElement(card.icon as ReactElement<any>, { size: 80, className: "text-white" })}
                                    </div>

                                    {/* Bottom Content (Inverted) */}
                                    <div className="flex flex-col items-center rotate-180 z-10">
                                        <span className="text-xs font-bold text-gray-300 uppercase tracking-wide mb-1">{t(card.name).split(' ')[0]}</span>
                                        {cloneElement(card.icon as ReactElement<any>, { className: "text-white/80", size: 16 })}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <RegionDetailModal
                isOpen={!!selectedCard}
                onClose={() => setSelectedCard(null)}
                cardData={selectedCard}
            />
        </>
    );
};
