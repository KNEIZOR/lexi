'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ApiError } from '@/lib/api/api-client';
import { getDashboard, type DashboardData } from '@/lib/api/dashboard-api';
import { DashboardWelcome } from '../DashboardWelcome/DashboardWelcome';
import { DashboardStats } from '../DashboardStats/DashboardStats';
import { DashboardActions } from '../DashboardActions/DashboardActions';
import { DashboardLoading } from '../DashboardLoading/DashboardLoading';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
    const router = useRouter();
    const t = useTranslations('dashboard');

    const [data, setData] = useState<DashboardData | null>(null);

    const [error, setError] = useState(false);

    useEffect(() => {
        let mounted = true;

        const loadDashboard = async () => {
            try {
                const dashboard = await getDashboard();

                if (mounted) {
                    setData(dashboard);
                }
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

        void loadDashboard();

        return () => {
            mounted = false;
        };
    }, [router]);

    if (!data && !error) {
        return <DashboardLoading />;
    }

    if (error) {
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

    return (
        <main className={styles.page}>
            <div className={styles.backgroundGlow} />

            <div className={styles.container}>
                <DashboardWelcome
                    name={data.user.name}
                    level={data.user.learningLevel}
                />

                <DashboardStats stats={data.stats} />

                <DashboardActions />
            </div>
        </main>
    );
}
