import type { Locale } from '@/i18n/routing';

export interface NavigationItem {
    href: '/dashboard' | '/learning' | '/words' | '/profile';
    labelKey: 'dashboard' | 'learning' | 'words' | 'profile';
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
    {
        href: '/dashboard',
        labelKey: 'dashboard',
    },
    {
        href: '/learning',
        labelKey: 'learning',
    },
    {
        href: '/words',
        labelKey: 'words',
    },
    {
        href: '/profile',
        labelKey: 'profile',
    },
];
