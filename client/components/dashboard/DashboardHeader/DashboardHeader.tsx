'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/use-auth';
import { LanguageSwitcher } from '@/components/language-switcher/LanguageSwitcher/LanguageSwitcher';
import styles from './DashboardHeader.module.css';

interface DashboardHeaderProps {
    userName: string | null;
    email: string;
}

export function DashboardHeader({ userName, email }: DashboardHeaderProps) {
    const router = useRouter();
    const { logout } = useAuth();
    const t = useTranslations('dashboard');

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

    const displayName = userName?.trim() || email;

    return (
        <header className={styles.header}>
            <div className={styles.brand}>
                <div className={styles.logo}>L</div>

                <span className={styles.brandName}>LEXI</span>
            </div>

            <div className={styles.right}>
                <LanguageSwitcher />

                <div className={styles.user}>
                    <div className={styles.avatar}>
                        {displayName.charAt(0).toUpperCase()}
                    </div>

                    <div className={styles.userInfo}>
                        <span className={styles.name}>{displayName}</span>

                        <span className={styles.email}>{email}</span>
                    </div>
                </div>

                <button
                    type="button"
                    className={styles.logout}
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                >
                    {isLoggingOut ? t('header.loggingOut') : t('header.logout')}
                </button>
            </div>
        </header>
    );
}
