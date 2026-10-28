import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { BoulderResponseDto } from '@api'
import { useBoulder } from '@/api/queries/useBoulder'
import { useWallImageData } from '@/api/queries/useWallImageBlob'
import { BackIcon } from '@/shared/icons'
import { cn } from '@/shared/lib/cn'
import { IconButton } from '@/shared/ui/IconButton'
import { Overlay } from '@/shared/ui/Overlay'
import { Sheet } from '@/shared/ui/Sheet'
import { ZoomPan } from '@/shared/ui/ZoomPan'
import { BoulderHolds } from './BoulderHolds'
import { BoulderList } from './BoulderList'

type BoulderViewerProps = {
  wallImageId: number
  // The boulder to show; undefined while no boulder is selected.
  boulderId: number | undefined
  onClose: () => void
  getHref: (boulder: BoulderResponseDto) => string
  linkState?: unknown
}

const LEGEND = [
  { key: 'start', ring: 'border-start' },
  { key: 'hand', ring: 'border-hand' },
  { key: 'foot', ring: 'border-foot border-dashed' },
  { key: 'finish', ring: 'border-finish' },
] as const

// Full-screen view of one boulder over the wall photo. It keeps showing the last boulder while it
// fades out after the selection is cleared.
export function BoulderViewer({
  wallImageId,
  boulderId,
  onClose,
  getHref,
  linkState,
}: BoulderViewerProps) {
  const { t } = useTranslation('boulders')
  const [shownId, setShownId] = useState(boulderId)
  const [listOpen, setListOpen] = useState(false)

  if (boulderId !== undefined && boulderId !== shownId) setShownId(boulderId)

  const boulder = useBoulder(shownId ?? 0, shownId !== undefined)
  const wall = useWallImageData(wallImageId)

  // A boulder that can't be loaded just leaves the page showing the list.
  const open = boulderId !== undefined && !boulder.isError

  return (
    <Overlay
      open={open}
      label={t('viewer.dialogLabel')}
      className="data-[state=closed]:animate-stage-out motion-reduce:animate-none"
    >
      <div className="absolute inset-0 animate-stage-in touch-none bg-neutral-900 motion-reduce:animate-none">
        <ZoomPan>
          {wall.data ? (
            <BoulderHolds
              blob={wall.data.blob}
              width={wall.data.width}
              height={wall.data.height}
              holds={boulder.data?.holds ?? []}
              label={t('viewer.photoLabel', { name: boulder.data?.name ?? '' })}
            />
          ) : null}
        </ZoomPan>
      </div>

      <IconButton
        label={t('viewer.back')}
        onClick={onClose}
        className="absolute top-3.5 left-3.5 bg-ground"
      >
        <BackIcon className="size-6" />
      </IconButton>

      <ul
        aria-label={t('legend.label')}
        className="absolute bottom-[calc(2.75rem+env(safe-area-inset-bottom)+0.5rem)] left-3.5 flex gap-4 bg-ground px-3 py-2 font-cond text-xs font-semibold tracking-wide uppercase"
      >
        {LEGEND.map(({ key, ring }) => (
          <li key={key} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={cn('size-3.5 rounded-full border-3', ring)} />
            {t(`legend.${key}`)}
          </li>
        ))}
      </ul>

      <Sheet
        open={listOpen}
        onOpenChange={setListOpen}
        label={t('viewer.list')}
        className="h-[70dvh] animate-sheet-lower motion-reduce:animate-none"
      >
        <BoulderList
          wallImageId={wallImageId}
          getHref={getHref}
          replace
          linkState={linkState}
          onSelect={() => setListOpen(false)}
        />
      </Sheet>
    </Overlay>
  )
}
