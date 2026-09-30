import { apiClient } from './api-client';
import type { LearningLevel, User } from './auth-api';

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

export interface DashboardData {
    user: User & {
        learningLevel: LearningLevel;
        nativeLanguageId: string | null;
        createdAt: string;
    };
    stats: DashboardStats;
}

export function getDashboard(): Promise<DashboardData> {
    return apiClient<DashboardData>('/api/dashboard');
}
