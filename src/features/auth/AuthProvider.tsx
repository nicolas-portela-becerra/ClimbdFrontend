import { useEffect, useState, type ReactNode } from 'react'
import type { UserDto, UserGymRoleDto } from '@api'
import { queryClient } from '@/api/queryClient'
import { AuthContext, type AuthEndReason, type AuthStatus } from './useAuth'
import { bootSession, logout, subscribeSession, watchOtherTabs } from './session'

type State = {
  status: AuthStatus
  user: UserDto | null
  gymRoles: UserGymRoleDto[]
  endReason: AuthEndReason
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({
    status: 'loading',
    user: null,
    gymRoles: [],
    endReason: null,
  })

  useEffect(() => {
    const unsubscribe = subscribeSession(({ user, gymRoles, expired }) => {
      if (user) {
        setState({ status: 'authenticated', user, gymRoles, endReason: null })
      } else {
        queryClient.clear()
        setState({
          status: 'anonymous',
          user: null,
          gymRoles: [],
          endReason: expired ? 'expired' : 'logout',
        })
      }
    })
    const stopWatching = watchOtherTabs()

    void bootSession().then((session) => {
      setState((current) =>
        current.status === 'loading'
          ? {
              status: session ? 'authenticated' : 'anonymous',
              user: session?.user ?? null,
              gymRoles: session?.gymRoles ?? [],
              endReason: null,
            }
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
