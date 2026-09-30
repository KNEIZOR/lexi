const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export interface ApiErrorResponse {
    code?: string;
    message?: string | string[];
    error?: string;
    statusCode?: number;
}

export class ApiError extends Error {
    readonly code: string | null;
    readonly statusCode: number | null;

    constructor(
        message: string,
        options?: {
            code?: string | null;
            statusCode?: number | null;
        },
    ) {
        super(message);

        this.name = 'ApiError';

        this.code = options?.code ?? null;
        this.statusCode = options?.statusCode ?? null;
    }
}

type ApiRequestOptions = RequestInit & {
    body?: BodyInit | null;
};

function getErrorMessage(data: unknown): string {
    if (typeof data === 'object' && data !== null && 'message' in data) {
        const message = (data as ApiErrorResponse).message;

        if (Array.isArray(message)) {
            return message.join(', ');
        }

        if (typeof message === 'string') {
            return message;
        }
    }

    return 'Request failed';
}

function getErrorCode(data: unknown): string | null {
    if (typeof data === 'object' && data !== null && 'code' in data) {
        const code = (data as ApiErrorResponse).code;

        return typeof code === 'string' ? code : null;
    }

    return null;
}

function getStatusCode(data: unknown, response: Response): number {
    if (typeof data === 'object' && data !== null && 'statusCode' in data) {
        const statusCode = (data as ApiErrorResponse).statusCode;

        if (typeof statusCode === 'number') {
            return statusCode;
        }
    }

    return response.status;
}

export async function apiClient<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    const contentType = response.headers.get('content-type');

    const isJson = contentType?.includes('application/json');

    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        throw new ApiError(getErrorMessage(data), {
            code: getErrorCode(data),
            statusCode: getStatusCode(data, response),
        });
    }

    return data as T;
}
