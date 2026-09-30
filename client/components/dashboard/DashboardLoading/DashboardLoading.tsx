import styles from './DashboardLoading.module.css';

export function DashboardLoading() {
    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <div className={styles.headerSkeleton} />

                <section className={styles.hero}>
                    <div className={styles.heroText}>
                        <div className={styles.lineSmall} />
                        <div className={styles.lineLarge} />
                        <div className={styles.lineMedium} />
                    </div>

                    <div className={styles.levelSkeleton} />
                </section>

                <section className={styles.stats}>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className={styles.card} />
                    ))}
                </section>
            </div>
        </main>
    );
}
