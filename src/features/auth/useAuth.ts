import { createContext, useContext } from 'react'
import type { UserDto } from '@api'

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'
// Why the user is not logged in anymore: they logged out (here or in another tab) or the session expired.
export type AuthEndReason = 'logout' | 'expired' | null

export type AuthContextValue = {
  status: AuthStatus
  user: UserDto | null
  endReason: AuthEndReason
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>')
  return value
}
