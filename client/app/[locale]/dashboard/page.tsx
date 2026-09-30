import dynamic from 'next/dynamic';
import { AppShell } from '@/components/app-shell/AppShell/AppShell';

const DashboardPage = dynamic(() =>
    import('@/components/dashboard/DashboardPage/DashboardPage').then(
        (module) => module.DashboardPage,
    ),
);

export default function DashboardRoute() {
    return (
        <AppShell>
            <DashboardPage />
        </AppShell>
    );
}
