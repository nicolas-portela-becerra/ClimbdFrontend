import { useTranslation } from 'react-i18next'
import { UserList } from '@/features/users/components/UserList'

export default function UsersActivate() {
  const { t } = useTranslation('users')

  return (
    <>
      <header className="px-5 pt-5 pb-3">
        <h1 className="font-display text-5xl leading-none font-extrabold uppercase">
          {t('title')}
        </h1>
      </header>
      <UserList />
    </>
  )
}
