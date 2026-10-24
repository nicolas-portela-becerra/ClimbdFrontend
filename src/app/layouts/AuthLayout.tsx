import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  const { t } = useTranslation()
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
      <p className="mb-8 font-display text-7xl leading-none font-extrabold uppercase">
        {t('appName')}
      </p>
      <Outlet />
    </main>
  )
}
