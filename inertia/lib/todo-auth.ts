/**
 * resources/lib/todo-auth.ts
 *
 * All JWT token logic lives here. If you ever switch from localStorage
 * to httpOnly cookies, this is the only file you need to change.
 */
import axios from 'axios'

const TOKEN_KEY = 'todo_jwt_token'

// ─── Token storage ────────────────────────────────────────────────────────────

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function isLoggedIn(): boolean {
  return getToken() !== null
}

// ─── Auth headers ─────────────────────────────────────────────────────────────

export function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── API calls ────────────────────────────────────────────────────────────────

interface AuthResponse {
  token: string
  user: { id: number; fullName: string; email: string }
  message: string
}

export async function signupForTodos(payload: {
  fullName: string
  email: string
  password: string
  passwordConfirmation: string
}): Promise<AuthResponse> {
  const response = await axios.post<AuthResponse>('/todo-auth/signup', payload)

  saveToken(response.data.token)
  return response.data
}

export async function loginForTodos(payload: {
  email: string
  password: string
}): Promise<AuthResponse> {
  const response = await axios.post<AuthResponse>('/todo-auth/login', payload)

  saveToken(response.data.token)
  return response.data
}

export async function logoutFromTodos(): Promise<void> {
  const token = getToken()
  if (token) {
    await axios
      .post(
        '/todo-auth/logout',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .catch(() => {})
  }
  removeToken()
}
