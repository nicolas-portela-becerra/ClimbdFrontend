import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useWallImage } from '@/api/queries/useWallImage'
import { apiErrorKind } from '@/shared/lib/apiError'
import { ErrorState } from '@/shared/ui/ErrorState'
import { Spinner } from '@/shared/ui/Spinner'
import { WallHero } from './WallHero'

type WallHeaderProps = {
  gymId: number
  wallId: number
  // Passed from the walls list; when missing (refresh, direct link) the wall is fetched.
  name: string | undefined
  // Shown at the top-right of the wall photo.
  action?: ReactNode
  children?: ReactNode
}

export function WallHeader({ gymId, wallId, name: passedName, action, children }: WallHeaderProps) {
  const { t } = useTranslation(['walls', 'common'])
  const navigate = useNavigate()
  const validId = Number.isInteger(wallId) && Number.isInteger(gymId)
  const query = useWallImage(wallId, validId && !passedName)

  const backToWalls = {
    label: t('back'),
    onClick: () => void navigate(`/gyms/${gymId}`),
  }
  const notFound = (
    <ErrorState title={t('notFound.title')} message={t('notFound.message')} action={backToWalls} />
  )

  if (!validId) return notFound

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
        notFound
      ) : (
        <ErrorState
          title={t('common:error.title')}
          message={t('common:error.message')}
          action={{ label: t('common:error.retry'), onClick: () => void query.refetch() }}
        />
      )
    }
    name = query.data.wallName ?? ''
  }

  return (
    <>
      <WallHero gymId={gymId} wallId={wallId} name={name} action={action} />
      {children}
    </>
  )
}
