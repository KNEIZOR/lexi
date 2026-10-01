import { apiClient } from './api-client';

export type UserRole = 'USER' | 'ADMIN';

export interface User {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    nativeLanguageId: string | null;
    activeLearningLanguageId: string | null;
}

interface AuthResponse {
    user: User;
}

interface LogoutResponse {
    success: boolean;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    email: string;
    password: string;
    name?: string;
}

export async function login(input: LoginInput): Promise<User> {
    const response = await apiClient<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(input),
    });

    return response.user;
}

export async function register(input: RegisterInput): Promise<User> {
    const response = await apiClient<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(input),
    });

    return response.user;
}

export async function logout(): Promise<void> {
    await apiClient<LogoutResponse>('/api/auth/logout', {
        method: 'POST',
    });
}

export async function getMe(): Promise<User> {
    const response = await apiClient<User>('/api/auth/me');

    return response;
}
