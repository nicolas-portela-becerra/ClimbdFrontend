import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { UserDtoRoleEnum } from '@api'
import { useAuth } from '@/features/auth/useAuth'
import { LockIcon, LogbookIcon, MeIcon, WallsIcon } from '@/shared/icons'
import { TabBar, type TabItem } from '@/shared/ui/TabBar'

export function AppLayout() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const items: TabItem[] = [
    { label: t('nav.walls'), icon: <WallsIcon className="size-6" />, to: '/gyms' },
    { label: t('nav.logbook'), icon: <LogbookIcon className="size-6" /> },
    { label: t('nav.me'), icon: <MeIcon className="size-6" />, to: '/me' },
  ]
  if (user?.role === UserDtoRoleEnum.Admin) {
    items.push({
      label: t('nav.users'),
      icon: <LockIcon className="size-6" />,
      to: '/users/activate',
    })
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
      <TabBar items={items} label={t('nav.label')} />
    </div>
  )
}
