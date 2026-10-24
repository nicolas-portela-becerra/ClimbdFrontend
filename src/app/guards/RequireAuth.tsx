import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { Spinner } from '@/shared/ui/Spinner'

export function RequireAuth() {
  const { status, endReason } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Spinner />
      </div>
    )
  }

  if (status === 'anonymous') {
    // After an explicit logout the user lands on a plain /login; otherwise we remember where they were.
    const next = encodeURIComponent(location.pathname + location.search)
    const to = endReason === 'logout' ? '/login' : `/login?next=${next}`
    return <Navigate to={to} replace />
  }

  return <Outlet />
}
