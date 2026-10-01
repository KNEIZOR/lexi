'use client';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/use-auth';
import { ApiError } from '@/lib/api/api-client';
import styles from './AuthForm.module.css';
type AuthMode = 'login' | 'register';
interface AuthFormProps {
    mode: AuthMode;
}
type AuthErrorCode =
    | 'AUTH_EMAIL_ALREADY_EXISTS'
    | 'AUTH_INVALID_CREDENTIALS'
    | 'AUTH_USER_NOT_FOUND'
    | 'VALIDATION_ERROR'
    | 'UNKNOWN_ERROR';
const AUTH_ERROR_CODES: ReadonlySet<string> = new Set<AuthErrorCode>([
    'AUTH_EMAIL_ALREADY_EXISTS',
    'AUTH_INVALID_CREDENTIALS',
    'AUTH_USER_NOT_FOUND',
    'VALIDATION_ERROR',
    'UNKNOWN_ERROR',
]);
function getAuthErrorCode(error: unknown): AuthErrorCode {
    if (
        error instanceof ApiError &&
        error.code &&
        AUTH_ERROR_CODES.has(error.code)
    ) {
        return error.code as AuthErrorCode;
    }
    if (error instanceof ApiError && error.statusCode === 400) {
        return 'VALIDATION_ERROR';
    }
    return 'UNKNOWN_ERROR';
}
export function AuthForm({ mode }: AuthFormProps) {
    const router = useRouter();
    const { login, register } = useAuth();
    const t = useTranslations('auth');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isRegister = mode === 'register';
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSubmitting) {
            return;
        }
        setError('');
        setIsSubmitting(true);
        try {
            if (isRegister) {
                await register({
                    name: name.trim() || undefined,
                    email: email.trim(),
                    password,
                });
                router.push('/learning');
            } else {
                await login({ email: email.trim(), password });
                router.push('/dashboard');
            }
            router.refresh();
        } catch (submitError) {
            const errorCode = getAuthErrorCode(submitError);
            setError(t(`errors.${errorCode}`));
        } finally {
            setIsSubmitting(false);
        }
    };
    const title = isRegister ? t('register.title') : t('login.title');
    const description = isRegister
        ? t('register.description')
        : t('login.description');
    const submitLabel = isRegister ? t('register.submit') : t('login.submit');
    const submittingLabel = isRegister
        ? t('register.submitting')
        : t('login.submitting');
    return (
        <div className={styles.wrapper}>
            {' '}
            <div className={styles.glow} />{' '}
            <div className={styles.card}>
                {' '}
                <div className={styles.brand}>
                    {' '}
                    <div className={styles.logo}>L</div>{' '}
                    <span className={styles.brandName}>LEXI</span>{' '}
                </div>{' '}
                <div className={styles.heading}>
                    {' '}
                    <span className={styles.eyebrow}>
                        {' '}
                        {t('vocabularyTrainer')}{' '}
                    </span>{' '}
                    <h1>{title}</h1> <p>{description}</p>{' '}
                </div>{' '}
                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                    noValidate
                >
                    {' '}
                    {isRegister && (
                        <div className={styles.field}>
                            {' '}
                            <label htmlFor="name">
                                {' '}
                                {t('fields.name')}{' '}
                            </label>{' '}
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder={t('fields.namePlaceholder')}
                                maxLength={100}
                                autoComplete="name"
                            />{' '}
                        </div>
                    )}{' '}
                    <div className={styles.field}>
                        {' '}
                        <label htmlFor="email">
                            {' '}
                            {t('fields.email')}{' '}
                        </label>{' '}
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder={t('fields.emailPlaceholder')}
                            maxLength={255}
                            required
                            autoComplete="email"
                        />{' '}
                    </div>{' '}
                    <div className={styles.field}>
                        {' '}
                        <div className={styles.labelRow}>
                            {' '}
                            <label htmlFor="password">
                                {' '}
                                {t('fields.password')}{' '}
                            </label>{' '}
                            {!isRegister && (
                                <span className={styles.passwordHint}>
                                    {' '}
                                    {t('fields.passwordHint')}{' '}
                                </span>
                            )}{' '}
                        </div>{' '}
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder={t('fields.passwordPlaceholder')}
                            minLength={8}
                            maxLength={128}
                            required
                            autoComplete={
                                isRegister ? 'new-password' : 'current-password'
                            }
                        />{' '}
                    </div>{' '}
                    {error && (
                        <div className={styles.error} role="alert">
                            {' '}
                            <span className={styles.errorIcon}>!</span>{' '}
                            <span>{error}</span>{' '}
                        </div>
                    )}{' '}
                    <button
                        className={styles.submit}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {' '}
                        {isSubmitting ? (
                            <>
                                {' '}
                                <span className={styles.spinner} />{' '}
                                <span>{submittingLabel}</span>{' '}
                            </>
                        ) : (
                            <>
                                {' '}
                                <span>{submitLabel}</span>{' '}
                                <span className={styles.arrow}>→</span>{' '}
                            </>
                        )}{' '}
                    </button>{' '}
                </form>{' '}
                <div className={styles.divider}>
                    {' '}
                    <span /> <span>{t('divider')}</span> <span />{' '}
                </div>{' '}
                <div className={styles.switch}>
                    {' '}
                    <span>
                        {' '}
                        {isRegister
                            ? t('register.haveAccount')
                            : t('login.noAccount')}{' '}
                    </span>{' '}
                    <Link href={isRegister ? '/login' : '/register'}>
                        {' '}
                        {isRegister
                            ? t('register.signIn')
                            : t('login.createAccount')}{' '}
                    </Link>{' '}
                </div>{' '}
                <div className={styles.footer}>
                    {' '}
                    <span>LEXI</span>{' '}
                    <span className={styles.footerDot}>•</span>{' '}
                    <span>{t('footer')}</span>{' '}
                </div>{' '}
            </div>{' '}
        </div>
    );
}
