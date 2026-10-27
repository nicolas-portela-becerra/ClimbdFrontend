import { useTranslation } from 'react-i18next'
import { useWallImages } from '@/api/queries/useWallImages'
import { Button } from '@/shared/ui/Button'
import { ErrorState } from '@/shared/ui/ErrorState'
import { Spinner } from '@/shared/ui/Spinner'
import { WallRow } from './WallRow'

export function WallList({ gymId }: { gymId: number }) {
  const { t } = useTranslation(['walls', 'common'])
  const query = useWallImages(gymId)

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

  const walls = query.data.pages.flatMap((page) => page.content ?? [])

  if (walls.length === 0) {
    return <ErrorState title={t('empty.title')} message={t('empty.message')} />
  }

  return (
    <div className="px-5 pb-6">
      <ul aria-label={t('list.label')} className="grid gap-4">
        {walls.map((wall) => (
          <WallRow key={wall.id} wall={wall} gymId={gymId} />
        ))}
      </ul>
      {query.isFetchNextPageError ? (
        <p role="alert" className="pt-3 text-sm font-semibold text-error">
          {t('list.loadMoreError')}
        </p>
      ) : null}
      {query.hasNextPage ? (
        <Button
          loading={query.isFetchingNextPage}
          onClick={() => void query.fetchNextPage()}
          className="mt-4"
        >
          {t('list.loadMore')}
        </Button>
      ) : null}
    </div>
  )
}
