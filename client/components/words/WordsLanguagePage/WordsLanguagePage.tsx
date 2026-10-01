'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { useRouter } from '@/i18n/navigation';

import { getLanguages, type Language } from '@/lib/api/languages-api';

import styles from './WordsLanguagePage.module.css';

const LANGUAGES_QUERY_KEY = ['languages'] as const;

type WordsTab = 'recommended' | 'custom';

interface WordsLanguagePageProps {
    languageCode: string;
}

export function WordsLanguagePage({ languageCode }: WordsLanguagePageProps) {
    const router = useRouter();
    const t = useTranslations('words');

    const [activeTab, setActiveTab] = useState<WordsTab>('recommended');

    const {
        data: languages = [],
        isLoading,
        isError,
    } = useQuery<Language[]>({
        queryKey: LANGUAGES_QUERY_KEY,
        queryFn: getLanguages,
    });

    const normalizedCode = languageCode.toUpperCase();

    const language = languages.find((item) => item.code === normalizedCode);

    if (isLoading) {
        return (
            <main className={styles.page}>
                <div className={styles.container}>
                    <p className={styles.loading}>{t('language.loading')}</p>
                </div>
            </main>
        );
    }

    if (isError || !language) {
        return (
            <main className={styles.page}>
                <div className={styles.container}>
                    <p className={styles.error}>{t('language.error')}</p>

                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={() => router.push('/words')}
                    >
                        {t('language.back')}
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <div className={styles.glow} />

            <div className={styles.container}>
                <button
                    type="button"
                    className={styles.backButton}
                    onClick={() => router.push('/words')}
                >
                    {t('language.back')}
                </button>

                <header className={styles.header}>
                    <span className={styles.eyebrow}>
                        {t('language.eyebrow')}
                    </span>

                    <h1>{language.name}</h1>

                    <p>{t('language.description')}</p>
                </header>

                <div className={styles.tabs}>
                    <button
                        type="button"
                        className={`${styles.tab} ${
                            activeTab === 'recommended' ? styles.activeTab : ''
                        }`}
                        onClick={() => setActiveTab('recommended')}
                    >
                        {t('tabs.recommended')}
                    </button>

                    <button
                        type="button"
                        className={`${styles.tab} ${
                            activeTab === 'custom' ? styles.activeTab : ''
                        }`}
                        onClick={() => setActiveTab('custom')}
                    >
                        {t('tabs.custom')}
                    </button>
                </div>

                <section className={styles.content}>
                    {activeTab === 'recommended' ? (
                        <div className={styles.placeholder}>
                            <span>01</span>

                            <div>
                                <h2>{t('recommended.title')}</h2>

                                <p>{t('recommended.description')}</p>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.placeholder}>
                            <span>02</span>

                            <div>
                                <h2>{t('custom.title')}</h2>

                                <p>{t('custom.description')}</p>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
