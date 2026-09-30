import styles from './DashboardStatCard.module.css';

interface DashboardStatCardProps {
    label: string;
    value: string | number;
    description?: string;
    icon: string;
    accent?: boolean;
}

export function DashboardStatCard({
    label,
    value,
    description,
    icon,
    accent = false,
}: DashboardStatCardProps) {
    return (
        <article className={`${styles.card} ${accent ? styles.accent : ''}`}>
            <div className={styles.top}>
                <span className={styles.icon}>{icon}</span>

                <span className={styles.label}>{label}</span>
            </div>

            <div className={styles.value}>{value}</div>

            {description && (
                <span className={styles.description}>{description}</span>
            )}
        </article>
    );
}
