import { Brain, Shield, Eye, Ear, Activity, Heart } from 'lucide-react';
import type { ReactNode } from 'react';

export interface BrainRegionDef {
    name: string;
    functions: string;
    sensitivity: number;
    icon: ReactNode;
}

export const brainRegionsData: { [key: string]: BrainRegionDef } = {
    frontalLobe: { name: "region_frontalLobe", functions: "Judgment, planning, social conduct, and speech.", sensitivity: 1.2, icon: <Brain size={24} /> },
    parietalLobe: { name: "region_parietalLobe", functions: "Sensory information, perception, and spatial awareness.", sensitivity: 0.9, icon: <Shield size={24} /> },
    occipitalLobe: { name: "region_occipitalLobe", functions: "Visual processing and interpretation.", sensitivity: 0.8, icon: <Eye size={24} /> },
    temporalLobe: { name: "region_temporalLobe", functions: "Auditory processing and language comprehension.", sensitivity: 1.0, icon: <Ear size={24} /> },
    cerebellum: { name: "region_cerebellum", functions: "Coordination, balance, and motor control.", sensitivity: 1.5, icon: <Activity size={24} /> },
    brainstem: { name: "region_brainstem", functions: "Controls vital functions like breathing, heart rate, and consciousness.", sensitivity: 2.0, icon: <Heart size={24} /> },
};
