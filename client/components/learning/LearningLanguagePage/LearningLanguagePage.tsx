'use client';

import { useMemo, useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { useRouter } from '@/i18n/navigation';

import { ApiError } from '@/lib/api/api-client';

import { getLanguages } from '@/lib/api/languages-api';

import {
    createUserLanguage,
    getUserLanguages,
    type LanguageLevel,
} from '@/lib/api/user-languages-api';

import { LevelSelector } from '@/components/languages/LevelSelector/LevelSelector';

import styles from './LearningLanguagePage.module.css';

const LANGUAGES_QUERY_KEY = ['languages'] as const;
const USER_LANGUAGES_QUERY_KEY = ['user-languages'] as const;

interface LearningLanguagePageProps {
    languageCode: string;
}

export function LearningLanguagePage({
    languageCode,
}: LearningLanguagePageProps) {
    const router = useRouter();
    const t = useTranslations('learning');
    const queryClient = useQueryClient();

    const [selectedLevel, setSelectedLevel] = useState<LanguageLevel | null>(
        null,
    );

    const [errorCode, setErrorCode] = useState<string | null>(null);

    const normalizedCode = languageCode.toUpperCase();

    const {
        data: languages = [],
        isLoading: isLanguagesLoading,
        isError: isLanguagesError,
    } = useQuery({
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

    const language = useMemo(
        () => languages.find((item) => item.code === normalizedCode) ?? null,
        [languages, normalizedCode],
    );

    const userLanguage = useMemo(
        () =>
            language
                ? (userLanguages.find(
                      (item) => item.languageId === language.id,
                  ) ?? null)
                : null,
        [language, userLanguages],
    );

    const createMutation = useMutation({
        mutationFn: createUserLanguage,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: USER_LANGUAGES_QUERY_KEY,
            });

            await queryClient.invalidateQueries({
                queryKey: ['auth', 'me'],
            });

            await queryClient.invalidateQueries({
                queryKey: ['dashboard'],
            });
        },

        onError: (error) => {
            if (error instanceof ApiError) {
                setErrorCode(error.code);
                return;
            }

            setErrorCode('UNKNOWN_ERROR');
        },
    });

    const handleContinue = () => {
        if (!language || !selectedLevel) {
            return;
        }

        setErrorCode(null);

        createMutation.mutate({
            languageId: language.id,
            level: selectedLevel,
        });
    };

    const isLoading = isLanguagesLoading || isUserLanguagesLoading;

    const isError = isLanguagesError || isUserLanguagesError;

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
                        onClick={() => router.push('/learning')}
                    >
                        {t('language.back')}
                    </button>
                </div>
            </main>
        );
    }

    if (userLanguage) {
        return (
            <main className={styles.page}>
                <div className={styles.glow} />

                <div className={styles.container}>
                    <span className={styles.eyebrow}>
                        {t('program.eyebrow')}
                    </span>

                    <h1>{language.name}</h1>

                    <div className={styles.levelBadge}>
                        {userLanguage.level}
                    </div>

                    <section className={styles.programPlaceholder}>
                        <span className={styles.placeholderNumber}>01</span>

                        <div>
                            <h2>{t('program.title')}</h2>

                            <p>{t('program.description')}</p>
                        </div>
                    </section>
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
                    onClick={() => router.push('/learning')}
                >
                    {t('language.back')}
                </button>

                <header className={styles.header}>
                    <span className={styles.eyebrow}>{t('level.eyebrow')}</span>

                    <h1>{language.name}</h1>

                    <p>{t('level.description')}</p>
                </header>

                <LevelSelector
                    value={selectedLevel}
                    onChange={(level) => {
                        setSelectedLevel(level);
                        setErrorCode(null);
                    }}
                    disabled={createMutation.isPending}
                />

                {errorCode && (
                    <p className={styles.errorMessage}>
                        {t(`errors.${errorCode}`)}
                    </p>
                )}

                <button
                    type="button"
                    className={styles.continueButton}
                    disabled={!selectedLevel || createMutation.isPending}
                    onClick={handleContinue}
                >
                    {createMutation.isPending
                        ? t('level.saving')
                        : t('level.continue')}
                </button>
            </div>
        </main>
    );
}
