'use client';

import type { ReactNode } from 'react';

import { QueryProvider } from './QueryProvider';
import { AuthProvider } from './AuthProvider';

interface AppProvidersProps {
    children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
    );
}
