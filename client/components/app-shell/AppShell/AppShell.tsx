'use client';

import type { ReactNode } from 'react';
import { AppHeader } from '@/components/navigation/AppHeader/AppHeader';
import styles from './AppShell.module.css';

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className={styles.shell}>
            <AppHeader />

            <main className={styles.main}>{children}</main>
        </div>
    );
}
