import { useTranslation } from 'react-i18next'
import type { WallImageSummary } from '@api'
import { useWallImageThumbnail } from '@/api/queries/useWallImageBlob'
import { useWallImages } from '@/api/queries/useWallImages'
import { AuthImage } from '@/shared/ui/AuthImage'
import { Button } from '@/shared/ui/Button'
import { ErrorState } from '@/shared/ui/ErrorState'
import { ModalHeader, ModalPanel } from '@/shared/ui/ModalPanel'
import { Spinner } from '@/shared/ui/Spinner'

type WallPickerModalProps = {
  open: boolean
  onClose: () => void
  gymId: number
  onPick: (wallImageId: number) => void
}

// A competition can use several walls: the organiser picks the one the new boulder is on.
export function WallPickerModal({ open, onClose, gymId, onPick }: WallPickerModalProps) {
  const { t } = useTranslation('competitions')

  return (
    <ModalPanel open={open} label={t('organiser.pickWall')}>
      <ModalHeader
        title={t('organiser.pickWall')}
        closeLabel={t('organiser.close')}
        onClose={onClose}
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <WallChoices gymId={gymId} onPick={onPick} />
      </div>
    </ModalPanel>
  )
}

function WallChoices({ gymId, onPick }: { gymId: number; onPick: (id: number) => void }) {
  const { t } = useTranslation(['competitions', 'common'])
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
    return <p className="px-5 py-8 text-muted">{t('organiser.noWalls')}</p>
  }

  return (
    <div className="px-5 pb-8">
      <ul className="grid gap-3">
        {walls.map((wall) => (
          <WallChoice key={wall.id} wall={wall} onPick={onPick} />
        ))}
      </ul>
      {query.hasNextPage ? (
        <Button
          loading={query.isFetchingNextPage}
          onClick={() => void query.fetchNextPage()}
          className="mt-4"
        >
          {t('organiser.loadMore')}
        </Button>
      ) : null}
    </div>
  )
}

function WallChoice({ wall, onPick }: { wall: WallImageSummary; onPick: (id: number) => void }) {
  const thumbnail = useWallImageThumbnail(wall.id ?? 0)
  return (
    <li>
      <button
        type="button"
        onClick={() => wall.id !== undefined && onPick(wall.id)}
        className="relative block h-32 w-full overflow-hidden bg-neutral-800 text-left active:opacity-90"
      >
        <AuthImage blob={thumbnail.data} alt="" />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/70 to-transparent"
        />
        <span className="absolute right-4 bottom-2 left-4 font-display text-3xl leading-none font-extrabold text-white uppercase">
          {wall.wallName}
        </span>
      </button>
    </li>
  )
}
