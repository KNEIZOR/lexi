import { apiClient } from './api-client';

export type UserRole = 'USER' | 'ADMIN';

export type LearningLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface User {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    learningLevel: LearningLevel;
    nativeLanguageId?: string | null;
    createdAt?: string;
}

export interface RegisterInput {
    email: string;
    password: string;
    name?: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

interface AuthResponse {
    user: User;
}

export function register(input: RegisterInput): Promise<AuthResponse> {
    return apiClient<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(input),
    });
}

export function login(input: LoginInput): Promise<AuthResponse> {
    return apiClient<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(input),
    });
}

export function logout(): Promise<{ message: string }> {
    return apiClient<{ message: string }>('/api/auth/logout', {
        method: 'POST',
    });
}

export function getMe(): Promise<User> {
    return apiClient<User>('/api/auth/me');
}
