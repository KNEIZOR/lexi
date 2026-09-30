'use client';

import { useState } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/use-auth';
import { LanguageSwitcher } from '@/components/language-switcher/LanguageSwitcher/LanguageSwitcher';
import { NAVIGATION_ITEMS } from '../config/navigation';
import styles from './AppHeader.module.css';

export function AppHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const t = useTranslations('navigation');

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(true);

        try {
            await logout();

            router.push('/login');
            router.refresh();
        } finally {
            setIsLoggingOut(false);
        }
    };

    const displayName = user?.name?.trim() || user?.email || '';

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <div className={styles.left}>
                    <div className={styles.brand}>
                        <div className={styles.logo}>L</div>

                        <span className={styles.brandName}>LEXI</span>
                    </div>

                    <nav
                        className={styles.navigation}
                        aria-label={t('ariaLabel')}
                    >
                        {NAVIGATION_ITEMS.map((item) => {
                            const isActive = pathname === item.href;

                            return (
                                <button
                                    key={item.href}
                                    type="button"
                                    className={`${styles.navItem} ${
                                        isActive ? styles.active : ''
                                    }`}
                                    onClick={() => router.push(item.href)}
                                >
                                    {t(item.labelKey)}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className={styles.right}>
                    <LanguageSwitcher />

                    <div className={styles.user}>
                        <div className={styles.avatar}>
                            {displayName.charAt(0).toUpperCase()}
                        </div>

                        <div className={styles.userInfo}>
                            <span className={styles.name}>{displayName}</span>

                            <span className={styles.email}>{user?.email}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className={styles.logout}
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? t('loggingOut') : t('logout')}
                    </button>
                </div>
            </div>
        </header>
    );
}
