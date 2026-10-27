import { useTranslation } from 'react-i18next'
import type { BoulderResponseDto } from '@api'
import { useBouldersByWall } from '@/api/queries/useBouldersByWall'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { ErrorState } from '@/shared/ui/ErrorState'
import { Spinner } from '@/shared/ui/Spinner'
import { BoulderRow } from './BoulderRow'

type BoulderListProps = {
  wallImageId: number
  getHref: (boulder: BoulderResponseDto) => string
  replace?: boolean
  linkState?: unknown
  onSelect?: () => void
  className?: string
}

export function BoulderList({
  wallImageId,
  getHref,
  replace,
  linkState,
  onSelect,
  className,
}: BoulderListProps) {
  const { t } = useTranslation(['boulders', 'common'])
  const query = useBouldersByWall(wallImageId)

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

  const boulders = query.data.pages.flatMap((page) => page.content ?? [])

  if (boulders.length === 0) {
    return <ErrorState title={t('empty.title')} message={t('empty.message')} />
  }

  return (
    <section className={cn('px-5 pt-2 pb-6', className)}>
      <ul aria-label={t('list.label')}>
        {boulders.map((boulder) => (
          <BoulderRow
            key={boulder.id}
            boulder={boulder}
            href={getHref(boulder)}
            replace={replace}
            linkState={linkState}
            onSelect={onSelect}
          />
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
    </section>
  )
}
