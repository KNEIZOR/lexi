'use client';

import type { Language } from '@/lib/api/languages-api';

import { useTranslations } from 'next-intl';

import { LANGUAGE_DISPLAY_CONFIG } from '@/components/languages/config/languages';

import styles from './LanguageSelectionList.module.css';

interface LanguageSelectionListProps {
    languages: Language[];
    disabled?: boolean;
    onSelect: (language: Language) => void;
}

export function LanguageSelectionList({
    languages,
    disabled = false,
    onSelect,
}: LanguageSelectionListProps) {
    const t = useTranslations('languages');

    return (
        <div className={styles.list}>
            {languages.map((language) => {
                const config = LANGUAGE_DISPLAY_CONFIG[language.code];

                return (
                    <button
                        key={language.id}
                        type="button"
                        className={styles.card}
                        disabled={disabled}
                        onClick={() => onSelect(language)}
                    >
                        <span className={styles.flag} aria-hidden="true">
                            {config.flag}
                        </span>

                        <span className={styles.name}>
                            {t(`names.${language.code}`)}
                        </span>

                        <span className={styles.arrow} aria-hidden="true">
                            →
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
