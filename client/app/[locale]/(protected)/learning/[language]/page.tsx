import { LearningLanguagePage } from '@/components/learning/LearningLanguagePage/LearningLanguagePage';

interface LearningLanguagePageRouteProps {
    params: Promise<{
        language: string;
    }>;
}

export default async function LearningLanguageRoutePage({
    params,
}: LearningLanguagePageRouteProps) {
    const { language } = await params;

    return <LearningLanguagePage languageCode={language} />;
}
