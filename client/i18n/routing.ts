import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'ru', 'hy', 'it', 'es'],
    defaultLocale: 'en',
    localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
