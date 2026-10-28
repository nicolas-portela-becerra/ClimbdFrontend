import {
  AuthApi,
  BouldersApi,
  Configuration,
  GymsApi,
  UsersApi,
  WallImagesApi,
  type Middleware,
} from '@api'

export type RefreshOutcome = 'ok' | 'invalid' | 'unreachable'

export type AuthHandlers = {
  getAccessToken: () => string | null
  refresh: () => Promise<RefreshOutcome>
  onSessionExpired: () => void
}

let handlers: AuthHandlers | null = null

export function registerAuthHandlers(next: AuthHandlers): void {
  handlers = next
}

// Auth endpoints never trigger a refresh (login/register/refresh/oauth/logout answer 401 on their own terms).
// logout-all is the exception: it needs a valid session like any other call.
function isAuthEndpoint(url: string): boolean {
  return url.includes('/api/auth/') && !url.includes('/api/auth/logout-all')
}

function withBearer(init: RequestInit, token: string): RequestInit {
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${token}`)
  return { ...init, headers }
}

const authMiddleware: Middleware = {
  async pre({ url, init }) {
    const token = handlers?.getAccessToken()
    if (!token) return
    return { url, init: withBearer(init, token) }
  },
  async post({ fetch, url, init, response }) {
    if (response.status !== 401 || isAuthEndpoint(url) || !handlers) return
    const outcome = await handlers.refresh()
    if (outcome === 'unreachable') return
    const token = handlers.getAccessToken()
    if (outcome === 'invalid' || !token) {
      handlers.onSessionExpired()
      return
    }
    // context.fetch skips the middleware, so a second 401 is returned as is (no loop)
    return fetch(url, withBearer(init, token))
  },
}

// Same-origin: nginx (prod) and the Vite dev server proxy /api to the backend.
const config = new Configuration({ basePath: '', middleware: [authMiddleware] })

export const authApi = new AuthApi(config)
export const usersApi = new UsersApi(config)
export const gymsApi = new GymsApi(config)
export const wallImagesApi = new WallImagesApi(config)
export const bouldersApi = new BouldersApi(config)

// No middleware: used by the session code itself (login, refresh…) to avoid refresh loops.
export const publicAuthApi = new AuthApi(new Configuration({ basePath: '' }))
