import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useGym } from '@/api/queries/useGym'
import { BackIcon } from '@/shared/icons'
import { apiErrorKind } from '@/shared/lib/apiError'
import { ErrorState } from '@/shared/ui/ErrorState'
import { Spinner } from '@/shared/ui/Spinner'

type GymWallsHeaderProps = {
  gymId: number
  // Passed from the gyms list; when missing (refresh, direct link) the gym is fetched.
  name: string | undefined
  // Shown at the right of the header.
  action?: ReactNode
  children?: ReactNode
}

export function GymWallsHeader({ gymId, name: passedName, action, children }: GymWallsHeaderProps) {
  const { t } = useTranslation(['gyms', 'common'])
  const navigate = useNavigate()
  const validId = Number.isInteger(gymId)
  const query = useGym(gymId, validId && !passedName)

  const backToGyms = { label: t('walls.back'), onClick: () => void navigate('/gyms') }

  if (!validId) {
    return (
      <ErrorState title={t('notFound.title')} message={t('notFound.message')} action={backToGyms} />
    )
  }

  let name = passedName
  if (!name) {
    if (query.isPending) {
      return (
        <div className="grid place-items-center py-16">
          <Spinner />
        </div>
      )
    }
    if (query.isError) {
      return apiErrorKind(query.error) === 'notFound' ? (
        <ErrorState
          title={t('notFound.title')}
          message={t('notFound.message')}
          action={backToGyms}
        />
      ) : (
        <ErrorState
          title={t('common:error.title')}
          message={t('common:error.message')}
          action={{ label: t('common:error.retry'), onClick: () => void query.refetch() }}
        />
      )
    }
    name = query.data.name ?? ''
  }

  return (
    <>
      <header className="flex items-center gap-1 px-2 pt-5 pb-3">
        <Link
          to="/gyms"
          aria-label={t('walls.back')}
          className="grid size-11 shrink-0 place-items-center"
        >
          <BackIcon className="size-6" />
        </Link>
        <h1 className="min-w-0 font-display text-4xl leading-none font-extrabold uppercase">
          {t('walls.title', { name })}
        </h1>
        {action ? <div className="ml-auto shrink-0 pr-3">{action}</div> : null}
      </header>
      {children}
    </>
  )
}
