const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type ApiRequestOptions = RequestInit & {
    body?: BodyInit | null;
};

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
        const message =
            typeof data === 'object' && data !== null && 'message' in data
                ? String(data.message)
                : 'Request failed';

        throw new Error(message);
    }

    return data as T;
}
