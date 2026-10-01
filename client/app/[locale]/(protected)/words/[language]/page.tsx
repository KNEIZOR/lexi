import { WordsLanguagePage } from '@/components/words/WordsLanguagePage/WordsLanguagePage';

interface WordsLanguageRouteProps {
    params: Promise<{
        language: string;
    }>;
}

export default async function WordsLanguageRoute({
    params,
}: WordsLanguageRouteProps) {
    const { language } = await params;

    return <WordsLanguagePage languageCode={language} />;
}
