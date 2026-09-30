import { useTranslations } from 'next-intl';
import type { DashboardStats as DashboardStatsData } from '@/lib/api/dashboard-api';
import { DashboardStatCard } from '../DashboardStatCard/DashboardStatCard';
import styles from './DashboardStats.module.css';

interface DashboardStatsProps {
    stats: DashboardStatsData;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    const t = useTranslations('dashboard.stats');

    const cards = [
        {
            key: 'totalWords',
            label: t('totalWords'),
            value: stats.totalWords,
            icon: '◈',
            accent: true,
        },
        {
            key: 'newWords',
            label: t('newWords'),
            value: stats.newWords,
            icon: '＋',
        },
        {
            key: 'learningWords',
            label: t('learningWords'),
            value: stats.learningWords,
            icon: '◌',
        },
        {
            key: 'masteredWords',
            label: t('masteredWords'),
            value: stats.masteredWords,
            icon: '✓',
        },
        {
            key: 'sessions',
            label: t('sessions'),
            value: stats.totalSessions,
            icon: '↗',
        },
        {
            key: 'accuracy',
            label: t('accuracy'),
            value: `${stats.accuracy}%`,
            icon: '%',
        },
        {
            key: 'streak',
            label: t('streak'),
            value: stats.currentStreak,
            icon: '◆',
        },
        {
            key: 'attempts',
            label: t('attempts'),
            value: stats.totalAttempts,
            icon: '↻',
        },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.heading}>
                <span>{t('title')}</span>
            </div>

            <div className={styles.grid}>
                {cards.map((card) => (
                    <DashboardStatCard
                        key={card.key}
                        label={card.label}
                        value={card.value}
                        icon={card.icon}
                        accent={card.accent}
                    />
                ))}
            </div>
        </section>
    );
}
