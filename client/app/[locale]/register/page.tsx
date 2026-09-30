import { AuthForm } from '@/components/auth/AuthForm';
import { LanguageSwitcher } from '@/components/language-switcher/LanguageSwitcher';

export default function RegisterPage() {
    return (
        <>
            <LanguageSwitcher />
            <AuthForm mode="register" />
        </>
    );
}
