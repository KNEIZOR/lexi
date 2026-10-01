'use client';

import type { LanguageLevel } from '@/lib/api/user-languages-api';

import styles from './LevelSelector.module.css';

const LEVELS: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

interface LevelSelectorProps {
    value: LanguageLevel | null;
    onChange: (level: LanguageLevel) => void;
    disabled?: boolean;
}

export function LevelSelector({
    value,
    onChange,
    disabled = false,
}: LevelSelectorProps) {
    return (
        <div className={styles.grid}>
            {LEVELS.map((level) => (
                <button
                    key={level}
                    type="button"
                    className={`${styles.button} ${
                        value === level ? styles.active : ''
                    }`}
                    onClick={() => onChange(level)}
                    disabled={disabled}
                    aria-pressed={value === level}
                >
                    {level}
                </button>
            ))}
        </div>
    );
}
