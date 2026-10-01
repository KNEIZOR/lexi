import { apiClient } from './api-client';

export type LanguageCode =
    | 'RU'
    | 'EN'
    | 'HY'
    | 'DE'
    | 'ES'
    | 'FR'
    | 'IT'
    | 'PT'
    | 'TR';

export interface Language {
    id: string;
    code: LanguageCode;
    name: string;
    createdAt: string;
}

export function getLanguages(): Promise<Language[]> {
    return apiClient<Language[]>('/api/languages');
}
