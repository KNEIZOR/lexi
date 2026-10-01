import type { LanguageCode } from '@/lib/api/languages-api';

export interface LanguageDisplayConfig {
    code: LanguageCode;
    flag: string;
}

export const LANGUAGE_DISPLAY_CONFIG: Record<
    LanguageCode,
    LanguageDisplayConfig
> = {
    RU: {
        code: 'RU',
        flag: '🇷🇺',
    },
    EN: {
        code: 'EN',
        flag: '🇬🇧',
    },
    HY: {
        code: 'HY',
        flag: '🇦🇲',
    },
    DE: {
        code: 'DE',
        flag: '🇩🇪',
    },
    ES: {
        code: 'ES',
        flag: '🇪🇸',
    },
    FR: {
        code: 'FR',
        flag: '🇫🇷',
    },
    IT: {
        code: 'IT',
        flag: '🇮🇹',
    },
    PT: {
        code: 'PT',
        flag: '🇵🇹',
    },
    TR: {
        code: 'TR',
        flag: '🇹🇷',
    },
};
