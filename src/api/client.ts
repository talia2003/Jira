import { supabase } from '../lib/supabase'

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
    const {data: {session}} = await supabase.auth.getSession()

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string> | undefined),
    }
    
    if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`
    }
    const response = await fetch(`${API_URL}${path}`, {...options, headers})

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