'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { LANGUAGE_OPTIONS } from '../config/languages';
import styles from './LanguageSwitcher.module.css';

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('common');

    const [isOpen, setIsOpen] = useState(false);

    const switcherRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                switcherRef.current &&
                !switcherRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const currentLanguage =
        LANGUAGE_OPTIONS.find((language) => language.value === locale) ??
        LANGUAGE_OPTIONS[0];

    const handleLocaleChange = (nextLocale: Locale) => {
        if (nextLocale === locale) {
            setIsOpen(false);
            return;
        }

        setIsOpen(false);

        router.replace(pathname, {
            locale: nextLocale,
        });
    };

    return (
        <div ref={switcherRef} className={styles.wrapper}>
            <button
                type="button"
                className={styles.trigger}
                onClick={() => setIsOpen((previous) => !previous)}
                aria-label={t('language')}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <span className={styles.triggerLabel}>
                    {currentLanguage.label}
                </span>

                <span
                    className={`${styles.arrow} ${
                        isOpen ? styles.arrowOpen : ''
                    }`}
                    aria-hidden="true"
                >
                    ↓
                </span>
            </button>

            {isOpen && (
                <div
                    className={styles.dropdown}
                    role="listbox"
                    aria-label={t('language')}
                >
                    {LANGUAGE_OPTIONS.map((language) => {
                        const isActive = language.value === locale;

                        return (
                            <button
                                key={language.value}
                                type="button"
                                className={`${styles.option} ${
                                    isActive ? styles.active : ''
                                }`}
                                onClick={() =>
                                    handleLocaleChange(language.value)
                                }
                                role="option"
                                aria-selected={isActive}
                            >
                                <span>{language.label}</span>

                                {isActive && (
                                    <span
                                        className={styles.check}
                                        aria-hidden="true"
                                    >
                                        ✓
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
