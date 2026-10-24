import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { useAuth } from '@/features/auth/useAuth'
import { Spinner } from '@/shared/ui/Spinner'

export default function Register() {
  const { t } = useTranslation('auth')
  const { status } = useAuth()
  const navigate = useNavigate()
  const onRegistered = useCallback(
    () => navigate('/login', { replace: true, state: { registered: true } }),
    [navigate],
  )

  if (status === 'loading') return <Spinner className="mx-auto" />
  if (status === 'authenticated') return <Navigate to="/gyms" replace />

  return (
    <section className="grid gap-4">
      <h1 className="font-cond text-2xl font-bold uppercase">{t('register.title')}</h1>
      <RegisterForm onRegistered={onRegistered} />
      <p className="text-muted">
        {t('register.haveAccount')}{' '}
        <Link to="/login" className="font-semibold text-accent underline underline-offset-4">
          {t('register.toLogin')}
        </Link>
      </p>
    </section>
  )
}
