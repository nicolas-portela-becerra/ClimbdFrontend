import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/features/auth/useAuth'
import { LogoutIcon } from '@/shared/icons'
import { Button } from '@/shared/ui/Button'

export default function Profile() {
  const { t } = useTranslation()
  const { logout } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  return (
    <header className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
      <h1 className="font-display text-5xl leading-none font-extrabold uppercase">
        {t('routes.profile')}
      </h1>
      <Button
        aria-label={t('profile.logout')}
        loading={loggingOut}
        onClick={() => {
          setLoggingOut(true)
          void logout()
        }}
        className="size-11 min-h-11 w-11 shrink-0 border-error bg-error px-0 text-black"
      >
        <LogoutIcon className="size-6" />
      </Button>
    </header>
  )
}
