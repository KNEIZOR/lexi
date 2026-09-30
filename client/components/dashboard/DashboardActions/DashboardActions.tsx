import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import styles from './DashboardActions.module.css';

export function DashboardActions() {
    const t = useTranslations('dashboard.actions');

    return (
        <section className={styles.section}>
            <div className={styles.content}>
                <span className={styles.eyebrow}>{t('title')}</span>

                <h2>{t('description')}</h2>
            </div>

            <div className={styles.actions}>
                <Link href="/learning" className={styles.primary}>
                    <span>{t('startLearning')}</span>

                    <span className={styles.arrow}>→</span>
                </Link>

                <Link href="/words" className={styles.secondary}>
                    {t('reviewWords')}
                </Link>
            </div>
        </section>
    );
}
