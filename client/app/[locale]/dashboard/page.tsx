import dynamic from 'next/dynamic';

const DashboardPage = dynamic(() =>
    import('@/components/dashboard/DashboardPage/DashboardPage').then(
        (module) => module.DashboardPage,
    ),
);

export default function DashboardRoute() {
    return <DashboardPage />;
}
