import { useTranslation } from 'react-i18next'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { useAuth } from '@/features/auth/useAuth'
import { Spinner } from '@/shared/ui/Spinner'

// Only internal paths are accepted, to avoid open redirects.
function safeNext(next: string | null): string {
  if (next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/login')) {
    return next
  }
  return '/gyms'
}

export default function Login() {
  const { t } = useTranslation('auth')
  const { status, endReason } = useAuth()
  const [params] = useSearchParams()
  const location = useLocation()

  if (status === 'loading') return <Spinner className="mx-auto" />
  if (status === 'authenticated') return <Navigate to={safeNext(params.get('next'))} replace />

  const registered = (location.state as { registered?: boolean } | null)?.registered === true

  return (
    <section className="grid gap-4">
      <h1 className="font-cond text-2xl font-bold uppercase">{t('login.title')}</h1>
      {endReason === 'expired' ? (
        <p role="status" className="border-2 border-ink bg-surface p-3 font-semibold">
          {t('notices.sessionExpired')}
        </p>
      ) : null}
      {registered ? (
        <p role="status" className="border-2 border-accent bg-accent-field p-3 font-semibold">
          {t('notices.accountCreated')}
        </p>
      ) : null}
      <LoginForm />
      <p className="text-muted">
        {t('login.noAccount')}{' '}
        <Link to="/register" className="font-semibold text-accent underline underline-offset-4">
          {t('login.toRegister')}
        </Link>
      </p>
    </section>
  )
}
