import { useTranslation } from 'react-i18next'
import { useDeactivatedUsers } from '@/api/queries/useDeactivatedUsers'
import { ErrorState } from '@/shared/ui/ErrorState'
import { Spinner } from '@/shared/ui/Spinner'
import { UserRow } from './UserRow'

export function UserList() {
  const { t } = useTranslation(['users', 'common'])
  const query = useDeactivatedUsers()

  if (query.isPending) {
    return (
      <div className="grid place-items-center py-16">
        <Spinner />
      </div>
    )
  }

  if (query.isError) {
    return (
      <ErrorState
        title={t('common:error.title')}
        message={t('common:error.message')}
        action={{ label: t('common:error.retry'), onClick: () => void query.refetch() }}
      />
    )
  }

  const users = query.data.users ?? []

  if (users.length === 0) {
    return <ErrorState title={t('empty.title')} message={t('empty.message')} />
  }

  return (
    <ul aria-label={t('list.label')} className="px-5 pb-6">
      {users.map((user) => (
        <UserRow key={user.id} user={user} />
      ))}
    </ul>
  )
}
