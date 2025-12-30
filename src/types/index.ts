import type { ReactNode } from 'react';

export interface Drink {
    id?: string;
    type: string;
    volume: number;
    abv: number;
    alcoholGrams: number;
    timestamp: string; // ISO string
}

export interface CustomQuickAdd {
    id?: string;
    type: string;
    volume: number;
    abv: number;
    label: string;
}

export interface BrainRegionAnalysis {
    name: string;
    impact: number;
    effectText: string;
    impactColor: string;
    impactWord: string;
    icon: ReactNode;
}

export interface Analysis {
    [key: string]: BrainRegionAnalysis;
}

export interface Translations {
    [key: string]: {
        [key: string]: string | ((...args: any[]) => string);
    };
}

export interface WeeklyChartData {
    name: string;
    drinks: number;
}

export interface Achievement {
    id: string;
    nameKey: string;
    descriptionKey: string;
    earnedDate: string;
}

export interface DailyChallenge {
    id: string;
    textKey: string;
    completed: boolean;
    type: 'log_n_drinks' | 'stay_below_goal' | 'use_custom_quick_add';
    value?: number;
}
