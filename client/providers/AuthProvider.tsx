'use client';

import { useCallback, useMemo, type ReactNode } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    getMe,
    login as loginRequest,
    logout as logoutRequest,
    register as registerRequest,
    type LoginInput,
    type RegisterInput,
    type User,
} from '@/lib/api/auth-api';

import { AuthContext } from './AuthContext';

const AUTH_QUERY_KEY = ['auth', 'me'] as const;

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const queryClient = useQueryClient();

    const { data: user = null, isLoading } = useQuery<User | null>({
        queryKey: AUTH_QUERY_KEY,
        queryFn: getMe,
        retry: false,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        throwOnError: false,
    });

    const loginMutation = useMutation({
        mutationFn: loginRequest,
        onSuccess: (authenticatedUser) => {
            queryClient.setQueryData(AUTH_QUERY_KEY, authenticatedUser);
        },
    });

    const registerMutation = useMutation({
        mutationFn: registerRequest,
        onSuccess: (registeredUser) => {
            queryClient.setQueryData(AUTH_QUERY_KEY, registeredUser);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: logoutRequest,
        onSuccess: () => {
            queryClient.setQueryData(AUTH_QUERY_KEY, null);
        },
    });

    const login = useCallback(
        async (input: LoginInput): Promise<User> => {
            return loginMutation.mutateAsync(input);
        },
        [loginMutation],
    );

    const register = useCallback(
        async (input: RegisterInput): Promise<User> => {
            return registerMutation.mutateAsync(input);
        },
        [registerMutation],
    );

    const logout = useCallback(async (): Promise<void> => {
        await logoutMutation.mutateAsync();
    }, [logoutMutation]);

    const refreshUser = useCallback(async (): Promise<void> => {
        await queryClient.invalidateQueries({
            queryKey: AUTH_QUERY_KEY,
        });
    }, [queryClient]);

    const isAuthenticated = Boolean(user);
    const isAdmin = user?.role === 'ADMIN';

    const contextValue = useMemo(
        () => ({
            user,
            isLoading,
            isAuthenticated,
            isAdmin,
            login,
            register,
            logout,
            refreshUser,
        }),
        [
            user,
            isLoading,
            isAuthenticated,
            isAdmin,
            login,
            register,
            logout,
            refreshUser,
        ],
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}
