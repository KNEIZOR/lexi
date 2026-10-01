'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { useRouter } from '@/i18n/navigation';

import { getLanguages } from '@/lib/api/languages-api';

import { LanguageSelectionList } from '@/components/language-selection/LanguageSelectionList/LanguageSelectionList';

import styles from './WordsLanguageSelectionPage.module.css';

const LANGUAGES_QUERY_KEY = ['languages'] as const;

export function WordsLanguageSelectionPage() {
    const router = useRouter();
    const t = useTranslations('words');

    const {
        data: languages = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: LANGUAGES_QUERY_KEY,
        queryFn: getLanguages,
    });

    const handleLanguageSelect = (languageCode: string) => {
        router.push(`/words/${languageCode.toLowerCase()}`);
    };

    if (isLoading) {
        return (
            <main className={styles.page}>
                <div className={styles.container}>
                    <p className={styles.loading}>{t('selection.loading')}</p>
                </div>
            </main>
        );
    }

    if (isError) {
        return (
            <main className={styles.page}>
                <div className={styles.container}>
                    <p className={styles.error}>{t('selection.error')}</p>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <div className={styles.glow} />

            <div className={styles.container}>
                <header className={styles.header}>
                    <span className={styles.eyebrow}>
                        {t('selection.eyebrow')}
                    </span>

                    <h1>{t('selection.title')}</h1>

                    <p>{t('selection.description')}</p>
                </header>

                <LanguageSelectionList
                    languages={languages}
                    onSelect={(language) => handleLanguageSelect(language.code)}
                />
            </div>
        </main>
    );
}
