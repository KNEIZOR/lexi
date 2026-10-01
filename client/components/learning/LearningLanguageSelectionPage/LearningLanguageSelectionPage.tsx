'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { useRouter } from '@/i18n/navigation';

import { getLanguages, type Language } from '@/lib/api/languages-api';

import { getUserLanguages } from '@/lib/api/user-languages-api';

import { LanguageSelectionList } from '@/components/language-selection/LanguageSelectionList/LanguageSelectionList';

import styles from './LearningLanguageSelectionPage.module.css';

const LANGUAGES_QUERY_KEY = ['languages'] as const;
const USER_LANGUAGES_QUERY_KEY = ['user-languages'] as const;

export function LearningLanguageSelectionPage() {
    const router = useRouter();
    const t = useTranslations('learning');

    const {
        data: languages = [],
        isLoading: isLanguagesLoading,
        isError: isLanguagesError,
    } = useQuery<Language[]>({
        queryKey: LANGUAGES_QUERY_KEY,
        queryFn: getLanguages,
    });

    const {
        data: userLanguages = [],
        isLoading: isUserLanguagesLoading,
        isError: isUserLanguagesError,
    } = useQuery({
        queryKey: USER_LANGUAGES_QUERY_KEY,
        queryFn: getUserLanguages,
    });

    const handleLanguageSelect = (language: Language) => {
        router.push(`/learning/${language.code.toLowerCase()}`);
    };

    const isLoading = isLanguagesLoading || isUserLanguagesLoading;

    const isError = isLanguagesError || isUserLanguagesError;

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

    const availableLanguages = languages.filter((language) => {
        return !userLanguages.some(
            (userLanguage) => userLanguage.languageId === language.id,
        );
    });

    const addedLanguages = languages.filter((language) => {
        return userLanguages.some(
            (userLanguage) => userLanguage.languageId === language.id,
        );
    });

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

                {availableLanguages.length > 0 && (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2>{t('selection.availableTitle')}</h2>

                            <span>{t('selection.availableSubtitle')}</span>
                        </div>

                        <LanguageSelectionList
                            languages={availableLanguages}
                            onSelect={handleLanguageSelect}
                        />
                    </section>
                )}

                {addedLanguages.length > 0 && (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2>{t('selection.addedTitle')}</h2>

                            <span>{t('selection.addedSubtitle')}</span>
                        </div>

                        <LanguageSelectionList
                            languages={addedLanguages}
                            onSelect={handleLanguageSelect}
                        />
                    </section>
                )}
            </div>
        </main>
    );
}
