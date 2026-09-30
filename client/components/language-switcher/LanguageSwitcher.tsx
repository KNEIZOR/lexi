'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { usePathname, useRouter } from '@/i18n/navigation';
import styles from './LanguageSwitcher.module.css';

const locales: Array<{
    value: Locale;
    label: string;
}> = [
    {
        value: 'en',
        label: 'EN',
    },
    {
        value: 'ru',
        label: 'RU',
    },
];

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('common');

    const handleLocaleChange = (nextLocale: Locale) => {
        if (nextLocale === locale) {
            return;
        }

        router.replace(pathname, {
            locale: nextLocale,
        });
    };

    return (
        <div className={styles.switcher} aria-label={t('language')}>
            {locales.map((item) => (
                <button
                    key={item.value}
                    type="button"
                    className={`${styles.button} ${
                        locale === item.value ? styles.active : ''
                    }`}
                    onClick={() => handleLocaleChange(item.value)}
                    aria-pressed={locale === item.value}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
