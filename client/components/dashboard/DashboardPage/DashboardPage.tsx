'use client';

import { useCallback, useEffect, useState } from 'react';

import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

import { ApiError } from '@/lib/api/api-client';
import { getDashboard, type DashboardData } from '@/lib/api/dashboard-api';
import {
    activateUserLanguage,
    getUserLanguages,
    type LearningLanguage,
} from '@/lib/api/user-languages-api';

import { DashboardWelcome } from '../DashboardWelcome/DashboardWelcome';
import { DashboardStats } from '../DashboardStats/DashboardStats';
import { DashboardActions } from '../DashboardActions/DashboardActions';
import { DashboardLoading } from '../DashboardLoading/DashboardLoading';

import styles from './DashboardPage.module.css';

export function DashboardPage() {
    const router = useRouter();
    const t = useTranslations('dashboard');

    const [data, setData] = useState<DashboardData | null>(null);
    const [learningLanguages, setLearningLanguages] = useState<
        LearningLanguage[]
    >([]);
    const [error, setError] = useState(false);
    const [isSwitchingLanguage, setIsSwitchingLanguage] = useState(false);

    const loadDashboard = useCallback(async () => {
        const [dashboard, languages] = await Promise.all([
            getDashboard(),
            getUserLanguages(),
        ]);

        return {
            dashboard,
            languages,
        };
    }, []);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const result = await loadDashboard();

                if (!mounted) {
                    return;
                }

                setData(result.dashboard);
                setLearningLanguages(result.languages);
            } catch (requestError) {
                if (!mounted) {
                    return;
                }

                if (
                    requestError instanceof ApiError &&
                    requestError.statusCode === 401
                ) {
                    router.replace('/login');
                    return;
                }

                setError(true);
            }
        };

        void load();

        return () => {
            mounted = false;
        };
    }, [loadDashboard, router]);

    const handleLanguageChange = async (languageId: string) => {
        if (isSwitchingLanguage) {
            return;
        }

        const currentLanguageId = data?.user.activeLearningLanguage?.id ?? null;

        if (!languageId || languageId === currentLanguageId) {
            return;
        }

        setIsSwitchingLanguage(true);
        setError(false);

        try {
            await activateUserLanguage(languageId);

            const result = await loadDashboard();

            setData(result.dashboard);
            setLearningLanguages(result.languages);
        } catch (requestError) {
            if (
                requestError instanceof ApiError &&
                requestError.statusCode === 401
            ) {
                router.replace('/login');
                return;
            }

            setError(true);
        } finally {
            setIsSwitchingLanguage(false);
        }
    };

    if (!data && !error) {
        return <DashboardLoading />;
    }

    if (error && !data) {
        return (
            <main className={styles.page}>
                <div className={styles.error}>
                    <span className={styles.errorIcon}>!</span>

                    <p>{t('errors.UNKNOWN_ERROR')}</p>

                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                    >
                        {t('actions.startLearning')}
                    </button>
                </div>
            </main>
        );
    }

    if (!data) {
        return null;
    }

    const activeLearningLanguage = data.user.activeLearningLanguage;

    return (
        <main className={styles.page}>
            <div className={styles.backgroundGlow} />

            <div className={styles.container}>
                <DashboardWelcome
                    name={data.user.name}
                    level={activeLearningLanguage?.level ?? null}
                    languageCode={activeLearningLanguage?.language.code ?? null}
                    learningLanguages={learningLanguages}
                    activeLearningLanguageId={
                        activeLearningLanguage?.id ?? null
                    }
                    isSwitchingLanguage={isSwitchingLanguage}
                    onLanguageChange={handleLanguageChange}
                />

                <DashboardStats stats={data.stats} />

                <DashboardActions />
            </div>
        </main>
    );
}
