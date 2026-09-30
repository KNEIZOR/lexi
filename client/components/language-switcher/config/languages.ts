import type { Locale } from '@/i18n/routing';

export interface LanguageOption {
    value: Locale;
    label: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
    {
        value: 'en',
        label: 'English',
    },
    {
        value: 'ru',
        label: 'Русский',
    },
    {
        value: 'hy',
        label: 'Հայերեն',
    },
    {
        value: 'it',
        label: 'Italiano',
    },
    {
        value: 'es',
        label: 'Español',
    },
];
