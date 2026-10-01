import { apiClient } from './api-client';

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface LearningLanguage {
    id: string;
    userId: string;
    languageId: string;
    level: LanguageLevel;
    createdAt: string;
    updatedAt: string;
    language: {
        id: string;
        code: 'RU' | 'EN' | 'HY' | 'DE' | 'ES' | 'FR' | 'IT' | 'PT' | 'TR';
        name: string;
        createdAt: string;
    };
}

export interface CreateLearningLanguageInput {
    languageId: string;
    level: LanguageLevel;
}

export interface UpdateLearningLanguageInput {
    level: LanguageLevel;
}

export async function getUserLanguages(): Promise<LearningLanguage[]> {
    return apiClient<LearningLanguage[]>('/api/user-languages');
}

export async function createUserLanguage(
    input: CreateLearningLanguageInput,
): Promise<LearningLanguage> {
    return apiClient<LearningLanguage>('/api/user-languages', {
        method: 'POST',
        body: JSON.stringify(input),
    });
}

export async function updateUserLanguage(
    id: string,
    input: UpdateLearningLanguageInput,
): Promise<LearningLanguage> {
    return apiClient<LearningLanguage>(`/api/user-languages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
    });
}

export async function activateUserLanguage(
    id: string,
): Promise<LearningLanguage> {
    return apiClient<LearningLanguage>(`/api/user-languages/${id}/activate`, {
        method: 'POST',
    });
}

export async function deleteUserLanguage(
    id: string,
): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>(`/api/user-languages/${id}`, {
        method: 'DELETE',
    });
}
