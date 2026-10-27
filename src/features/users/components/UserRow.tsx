import { useTranslation } from 'react-i18next'
import type { UserDto } from '@api'
import { useActivateUser } from '@/api/queries/useActivateUser'
import { useToast } from '@/shared/hooks/useToast'
import { Button } from '@/shared/ui/Button'

export function UserRow({ user }: { user: UserDto }) {
  const { t } = useTranslation('users')
  const { showError } = useToast()
  const activate = useActivateUser()

  return (
    <li className="grid min-h-16 grid-cols-[1fr_auto] items-center gap-3 border-b-2 border-line py-3.5">
      <span className="min-w-0">
        <span className="block font-cond text-xl leading-tight font-bold break-words uppercase">
          {user.name}
        </span>
        <span className="block text-sm break-all text-muted">{user.email}</span>
      </span>
      <Button
        variant="primary"
        loading={activate.isPending}
        onClick={() =>
          user.id !== undefined &&
          activate.mutate(user.id, { onError: () => showError(t('errors.activate')) })
        }
        className="min-h-11 w-auto px-4 text-base"
      >
        {t('activate')}
      </Button>
    </li>
  )
}
