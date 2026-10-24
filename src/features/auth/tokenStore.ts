import { storage } from '@/shared/lib/storage'

export const REFRESH_TOKEN_KEY = 'climbd.refresh'

let accessToken: string | null = null

export const tokenStore = {
  getAccess: (): string | null => accessToken,
  getRefresh: (): string | null => storage.get(REFRESH_TOKEN_KEY),
  set(tokens: { accessToken: string; refreshToken: string }): void {
    accessToken = tokens.accessToken
    storage.set(REFRESH_TOKEN_KEY, tokens.refreshToken)
  },
  clear(): void {
    accessToken = null
    storage.remove(REFRESH_TOKEN_KEY)
  },
}
