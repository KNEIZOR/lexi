import { AuthForm } from '@/components/auth/AuthForm';
import { LanguageSwitcher } from '@/components/language-switcher/LanguageSwitcher';

export default function LoginPage() {
    return (
        <>
            <LanguageSwitcher />
            <AuthForm mode="login" />
        </>
    );
}
