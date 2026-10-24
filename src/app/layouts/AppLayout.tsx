import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { LogbookIcon, MeIcon, PlusIcon, WallsIcon } from '@/shared/icons'
import { TabBar, type TabItem } from '@/shared/ui/TabBar'

export function AppLayout() {
  const { t } = useTranslation()
  const items: TabItem[] = [
    { label: t('nav.walls'), icon: <WallsIcon className="size-6" />, to: '/gyms' },
    { label: t('nav.logbook'), icon: <LogbookIcon className="size-6" /> },
    { label: t('nav.set'), icon: <PlusIcon className="size-6" /> },
    { label: t('nav.me'), icon: <MeIcon className="size-6" />, to: '/me' },
  ]

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
      <TabBar items={items} label={t('nav.label')} />
    </div>
  )
}
