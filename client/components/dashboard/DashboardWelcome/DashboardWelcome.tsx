import { useTranslations } from 'next-intl';

import type { LanguageLevel } from '@/lib/api/dashboard-api';
import type { LearningLanguage } from '@/lib/api/user-languages-api';

import { LANGUAGE_DISPLAY_CONFIG } from '@/components/languages/config/languages';

import styles from './DashboardWelcome.module.css';

interface DashboardWelcomeProps {
    name: string | null;
    level: LanguageLevel | null;
    languageCode: LearningLanguage['language']['code'] | null;
    learningLanguages: LearningLanguage[];
    activeLearningLanguageId: string | null;
    isSwitchingLanguage: boolean;
    onLanguageChange: (languageId: string) => void;
}

export function DashboardWelcome({
    name,
    level,
    languageCode,
    learningLanguages,
    activeLearningLanguageId,
    isSwitchingLanguage,
    onLanguageChange,
}: DashboardWelcomeProps) {
    const t = useTranslations('dashboard');
    const tLanguages = useTranslations('languages');

    const firstName = name?.trim().split(/\s+/)[0] || 'Lexi';

    const currentLanguageConfig = languageCode
        ? LANGUAGE_DISPLAY_CONFIG[languageCode]
        : null;

    const currentLanguageName = languageCode
        ? tLanguages(`names.${languageCode}`)
        : null;

    return (
        <section className={styles.section}>
            <div className={styles.content}>
                <span className={styles.eyebrow}>{t('page.eyebrow')}</span>

                <h1>
                    {firstName}
                    <span>,</span>
                    <br />
                    {t('page.title')}
                </h1>

                <p>{t('page.description')}</p>
            </div>

            <div className={styles.rightControls}>
                <div className={styles.languageSelector}>
                    <label
                        htmlFor="dashboard-learning-language"
                        className={styles.languageLabel}
                    >
                        {t('language.label')}
                    </label>

                    <div className={styles.selectWrapper}>
                        {currentLanguageConfig && (
                            <span className={styles.flag} aria-hidden="true">
                                {currentLanguageConfig.flag}
                            </span>
                        )}

                        <select
                            id="dashboard-learning-language"
                            value={activeLearningLanguageId ?? ''}
                            disabled={
                                isSwitchingLanguage ||
                                learningLanguages.length === 0
                            }
                            onChange={(event) =>
                                onLanguageChange(event.target.value)
                            }
                        >
                            {learningLanguages.length === 0 ? (
                                <option value="">
                                    {t('language.noLanguages')}
                                </option>
                            ) : (
                                learningLanguages.map((learningLanguage) => (
                                    <option
                                        key={learningLanguage.id}
                                        value={learningLanguage.id}
                                    >
                                        {tLanguages(
                                            `names.${learningLanguage.language.code}`,
                                        )}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                </div>

                <div className={styles.level}>
                    <span className={styles.levelLabel}>
                        {t('level.label')}
                    </span>

                    <strong>{level ?? '—'}</strong>

                    <span className={styles.levelDescription}>
                        {currentLanguageName ?? t('level.description')}
                    </span>
                </div>
            </div>
        </section>
    );
}
