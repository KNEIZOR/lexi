'use client';

import { createContext } from 'react';

import type { LoginInput, RegisterInput, User } from '@/lib/api/auth-api';

export interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;

    login: (input: LoginInput) => Promise<User>;

    register: (input: RegisterInput) => Promise<User>;

    logout: () => Promise<void>;

    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
