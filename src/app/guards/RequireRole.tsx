import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import type { UserDtoRoleEnum } from '@api'
import { useAuth } from '@/features/auth/useAuth'
import { ErrorState } from '@/shared/ui/ErrorState'

export function RequireRole({ role }: { role: UserDtoRoleEnum }) {
  const { user } = useAuth()
  const { t } = useTranslation()

  if (user?.role !== role) {
    return <ErrorState title={t('error.forbiddenTitle')} message={t('error.forbiddenMessage')} />
  }
  return <Outlet />
}
