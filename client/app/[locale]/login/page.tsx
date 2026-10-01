import { AuthForm } from '@/components/auth/AuthForm';
import { LanguageSwitcher } from '@/components/language-switcher/LanguageSwitcher/LanguageSwitcher';

import styles from './page.module.css';

export default function LoginPage() {
    return (
        <main className={styles.page}>
            <div className={styles.languageSwitcher}>
                <LanguageSwitcher />
            </div>

            <AuthForm mode="login" />
        </main>
    );
}
