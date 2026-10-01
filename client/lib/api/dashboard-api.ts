import { apiClient } from './api-client';
import type { User } from './auth-api';

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface DashboardStats {
    totalWords: number;
    newWords: number;
    learningWords: number;
    masteredWords: number;
    totalSessions: number;
    totalAttempts: number;
    correctAnswers: number;
    accuracy: number;
    currentStreak: number;
}

export interface DashboardActiveLearningLanguage {
    id: string;
    level: LanguageLevel;
    language: {
        id: string;
        code: 'RU' | 'EN' | 'HY' | 'DE' | 'ES' | 'FR' | 'IT' | 'PT' | 'TR';
        name: string;
    };
}

export interface DashboardData {
    user: User & {
        nativeLanguageId: string | null;
        createdAt: string;
        activeLearningLanguage: DashboardActiveLearningLanguage | null;
    };
    stats: DashboardStats;
}

export function getDashboard(): Promise<DashboardData> {
    return apiClient<DashboardData>('/api/dashboard');
}
