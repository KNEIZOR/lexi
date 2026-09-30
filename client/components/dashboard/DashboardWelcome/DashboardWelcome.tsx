import { useTranslations } from 'next-intl';
import type { LearningLevel } from '@/lib/api/auth-api';
import styles from './DashboardWelcome.module.css';

interface DashboardWelcomeProps {
    name: string | null;
    level: LearningLevel;
}

export function DashboardWelcome({ name, level }: DashboardWelcomeProps) {
    const t = useTranslations('dashboard');

    const firstName = name?.trim().split(/\s+/)[0] || 'Lexi';

    return (
        <section className={styles.section}>
            <div className={styles.content}>
                <span className={styles.eyebrow}>{t('page.eyebrow')}</span>

                <h1>
                    {firstName}
                    <span>,</span>
                    <br />
                    {t('page.title')}
                </h1>

                <p>{t('page.description')}</p>
            </div>

            <div className={styles.level}>
                <span className={styles.levelLabel}>{t('level.label')}</span>

                <strong>{level}</strong>

                <span className={styles.levelDescription}>
                    {t('level.description')}
                </span>
            </div>
        </section>
    );
}
