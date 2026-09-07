export type DrinkType = 'beer' | 'wine' | 'spirits' | 'cocktail' | 'shot' | 'custom';

export interface Drink {
  id: string;
  name: string;
  type: DrinkType;
  volumeMl: number;
  abv: number; // e.g. 5.0 for 5%
  standardDrinks: number;
  timestamp: Date;
}

export type ImpactLevel = 'normal' | 'mild' | 'moderate' | 'high' | 'severe';

export interface BrainRegion {
  id: string;
  name: string;
  medicalName: string;
  role: string;
  bacThreshold: number; // e.g. 0.02
  sciFiDescription: string;
  neurotransmitterEffect: string;
  behavioralSymptom: string;
  location: { x: number; y: number; path: string };
}

export interface ScanResult {
  beverageName: string;
  type: DrinkType;
  abv: number;
  volumeMl: number;
  standardDrinks: number;
  confidence: number;
  rawAnalysis: string;
  scanTimestamp: string;
}

export interface AICoachAdvice {
  bacEstimate: number;
  riskLevel: 'OPTIMAL' | 'MILD_ELEVATION' | 'COGNITIVE_DECAY' | 'SEVERE_HAZARD';
  cognitiveStatus: string;
  timeToZeroHours: number;
  recommendations: string[];
  hydrationTip: string;
  warningAlert?: string;
}

export interface UserProfile {
  name: string;
  weightKg: number;
  gender: 'male' | 'female' | 'other';
  targetBacLimit: number; // e.g. 0.05
}
