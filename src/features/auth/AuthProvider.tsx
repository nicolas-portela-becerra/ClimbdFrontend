import { useEffect, useState, type ReactNode } from 'react'
import type { UserDto } from '@api'
import { queryClient } from '@/api/queryClient'
import { AuthContext, type AuthEndReason, type AuthStatus } from './useAuth'
import { bootSession, logout, subscribeSession, watchOtherTabs } from './session'

type State = { status: AuthStatus; user: UserDto | null; endReason: AuthEndReason }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ status: 'loading', user: null, endReason: null })

  useEffect(() => {
    const unsubscribe = subscribeSession(({ user, expired }) => {
      if (user) {
        setState({ status: 'authenticated', user, endReason: null })
      } else {
        queryClient.clear()
        setState({ status: 'anonymous', user: null, endReason: expired ? 'expired' : 'logout' })
      }
    })
    const stopWatching = watchOtherTabs()

    void bootSession().then((user) => {
      setState((current) =>
        current.status === 'loading'
          ? { status: user ? 'authenticated' : 'anonymous', user, endReason: null }
          : current,
      )
    })

    return () => {
      unsubscribe()
      stopWatching()
    }
  }, [])

  return <AuthContext value={{ ...state, logout }}>{children}</AuthContext>
}
