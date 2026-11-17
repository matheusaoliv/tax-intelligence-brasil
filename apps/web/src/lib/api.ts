const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api/v1').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly payload: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

function readMessage(payload: unknown): string {
  if (typeof payload === 'object' && payload !== null && 'message' in payload) {
    const message = payload.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(' ');
  }
  return 'Não foi possível concluir a solicitação.';
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (response.status === 204) return undefined as T;

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(readMessage(payload), response.status, payload);
  return payload as T;
}
