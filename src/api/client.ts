const API_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    })

    if(!response.ok) {
        const body = await response.json().catch(() => ({}))
        const message = body.error ?? response.statusText
        throw new ApiError(message, response.status)
    }

    return response.json()
}

export const api = {
    get: <T>(path: string) => request<T>(path),

    post: <T>(path: string, body: unknown) => 
        request<T>(path, {method: 'POST', body: JSON.stringify(body)}),

    patch: <T>(path: string, body: unknown) => 
        request<T>(path, {method: 'PATCH', body: JSON.stringify(body)}),

    delete: <T>(path: string) => 
        request<T>(path, {method: 'DELETE'}),
}