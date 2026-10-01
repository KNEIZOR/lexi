import { AuthForm } from '@/components/auth/AuthForm';
import { LanguageSwitcher } from '@/components/language-switcher/LanguageSwitcher/LanguageSwitcher';

import styles from './page.module.css';

export default function RegisterPage() {
    return (
        <main className={styles.page}>
            <div className={styles.languageSwitcher}>
                <LanguageSwitcher />
            </div>

            <AuthForm mode="register" />
        </main>
    );
}
