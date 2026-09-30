'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import {
    getMe,
    login as loginRequest,
    logout as logoutRequest,
    register as registerRequest,
    type LoginInput,
    type RegisterInput,
    type User,
} from '@/lib/api/auth-api';

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (input: LoginInput) => Promise<User>;
    register: (input: RegisterInput) => Promise<User>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = useCallback(async (): Promise<User | null> => {
        try {
            const currentUser = await getMe();

            setUser(currentUser);

            return currentUser;
        } catch {
            setUser(null);

            return null;
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            try {
                const currentUser = await getMe();

                if (mounted) {
                    setUser(currentUser);
                }
            } catch {
                if (mounted) {
                    setUser(null);
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        void initializeAuth();

        return () => {
            mounted = false;
        };
    }, []);

    const login = useCallback(async (input: LoginInput): Promise<User> => {
        const response = await loginRequest(input);

        setUser(response.user);

        return response.user;
    }, []);

    const register = useCallback(
        async (input: RegisterInput): Promise<User> => {
            const response = await registerRequest(input);

            setUser(response.user);

            return response.user;
        },
        [],
    );

    const logout = useCallback(async (): Promise<void> => {
        await logoutRequest();

        setUser(null);
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isLoading,
            isAuthenticated: user !== null,
            login,
            register,
            logout,
            refreshUser,
        }),
        [user, isLoading, login, register, logout, refreshUser],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used inside an AuthProvider');
    }

    return context;
}
