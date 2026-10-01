'use client';

import { useEffect } from 'react';

import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function LocalePage() {
    const router = useRouter();
    const { isLoading, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (isAuthenticated) {
            router.replace('/dashboard');
            return;
        }

        router.replace('/login');
    }, [isAuthenticated, isLoading, router]);

    return null;
}
