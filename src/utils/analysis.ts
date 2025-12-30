import type { Drink, Analysis } from '../types';
import { brainRegionsData } from './brainData';

export const analyzeConsumption = (drinks: Drink[], t: (key: string, ...args: any[]) => string): Analysis => {
    const totalAlcoholGrams = drinks.reduce((acc, drink) => acc + drink.alcoholGrams, 0);
    let analysis: Analysis = {};
    let overallImpactLevel = 0;

    // Simple log-based impact model
    if (totalAlcoholGrams > 0) {
        overallImpactLevel = Math.min(Math.log1p(totalAlcoholGrams / 10) * 1.5, 5);
    }

    Object.keys(brainRegionsData).forEach(key => {
        const region = brainRegionsData[key];
        const regionImpact = Math.min(overallImpactLevel * region.sensitivity, 5);
        let effectText: string = t('impact_nominal');
        let impactColor = "text-green-400";
        let impactWord = t('impact_low');

        if (regionImpact > 1.5 && regionImpact <= 3.5) {
            effectText = t('impact_noticeable', region.functions.toLowerCase());
            impactColor = "text-yellow-400";
            impactWord = t('impact_moderate');
        } else if (regionImpact > 3.5) {
            effectText = t('impact_significant', region.functions.toLowerCase());
            impactColor = "text-red-500";
            impactWord = t('impact_high');
        }

        analysis[key] = {
            name: region.name,
            impact: regionImpact,
            effectText,
            impactColor,
            impactWord,
            icon: region.icon
        };
    });

    return analysis;
};
