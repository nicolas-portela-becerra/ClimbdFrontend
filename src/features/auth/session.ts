import { ResponseError, type AuthResponse, type UserDto } from '@api'
import { publicAuthApi, registerAuthHandlers, type RefreshOutcome } from '@/api/client'
import { REFRESH_TOKEN_KEY, tokenStore } from './tokenStore'

export type SessionChange = { user: UserDto | null; expired: boolean }

const listeners = new Set<(change: SessionChange) => void>()

export function subscribeSession(listener: (change: SessionChange) => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function emit(change: SessionChange): void {
  listeners.forEach((listener) => listener(change))
}

function start(response: AuthResponse): UserDto {
  const { accessToken, refreshToken, user } = response
  if (!accessToken || !refreshToken || !user) throw new Error('Incomplete auth response')
  tokenStore.set({ accessToken, refreshToken })
  emit({ user, expired: false })
  return user
}

export async function login(email: string, password: string): Promise<UserDto> {
  return start(await publicAuthApi.authLogin({ loginRequest: { email, password } }))
}

// Registering does not start a session: the user goes to the login screen afterwards.
export async function register(name: string, email: string, password: string): Promise<void> {
  await publicAuthApi.authRegister({ registerRequest: { name, email, password } })
}

let inflight: Promise<RefreshOutcome> | null = null

// One refresh at a time: concurrent 401s (and StrictMode's double boot) share the same promise.
export function refreshSession(): Promise<RefreshOutcome> {
  inflight ??= doRefresh().finally(() => {
    inflight = null
  })
  return inflight
}

async function doRefresh(): Promise<RefreshOutcome> {
  const refreshToken = tokenStore.getRefresh()
  if (!refreshToken) return 'invalid'
  try {
    start(await publicAuthApi.authRefresh({ refreshRequest: { refreshToken } }))
    return 'ok'
  } catch (error) {
    // A response from the server means the token was rejected; anything else means we could not reach it.
    if (error instanceof ResponseError) {
      tokenStore.clear()
      return 'invalid'
    }
    return 'unreachable'
  }
}

export async function logout(): Promise<void> {
  const refreshToken = tokenStore.getRefresh()
  if (refreshToken) {
    try {
      await publicAuthApi.authLogout({ refreshRequest: { refreshToken } })
    } catch {
      // logout is idempotent on the server; the local session is cleared regardless
    }
  }
  tokenStore.clear()
  emit({ user: null, expired: false })
}

// On app start: exchange the saved refresh token for a session. Returns the user or null.
export async function bootSession(): Promise<UserDto | null> {
  if (!tokenStore.getRefresh()) return null
  const outcome = await refreshSession()
  // 'unreachable' keeps the saved token; the user sees the login screen and a reload retries
  return outcome === 'ok' ? currentUser : null
}

let currentUser: UserDto | null = null
subscribeSession(({ user }) => {
  currentUser = user
})

// Another tab logged out (or storage was cleared): drop the in-memory session here too.
export function watchOtherTabs(): () => void {
  const onStorage = (event: StorageEvent) => {
    if ((event.key === null || event.key === REFRESH_TOKEN_KEY) && event.newValue === null) {
      tokenStore.clear()
      emit({ user: null, expired: false })
    }
  }
  window.addEventListener('storage', onStorage)
  return () => window.removeEventListener('storage', onStorage)
}

registerAuthHandlers({
  getAccessToken: tokenStore.getAccess,
  refresh: refreshSession,
  onSessionExpired: () => {
    tokenStore.clear()
    emit({ user: null, expired: true })
  },
})
