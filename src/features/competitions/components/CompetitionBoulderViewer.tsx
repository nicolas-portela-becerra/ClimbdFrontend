import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CompetitionBoulderDto } from '@api'
import { useWallImageData } from '@/api/queries/useWallImageBlob'
import { BackIcon, MinusIcon, PlusIcon } from '@/shared/icons'
import { cn } from '@/shared/lib/cn'
import { BoulderHolds } from '@/shared/ui/BoulderHolds'
import { IconButton } from '@/shared/ui/IconButton'
import { Overlay } from '@/shared/ui/Overlay'
import { ZoomPan } from '@/shared/ui/ZoomPan'
import { updateEntry, useEntry } from '../entryStore'
import { addAttempt, logOf, removeAttempt, toggleTop } from '../results'

type Props = {
  // The boulder to show; undefined while none is selected.
  boulder: CompetitionBoulderDto | undefined
  userId: number
  competitionId: number
  // Registered and inside the logging window: the counter and TOP work.
  canLog: boolean
  onClose: () => void
}

// Full-screen boulder over its wall photo, with the attempt counter (bottom left) and TOP (bottom right).
export function CompetitionBoulderViewer({
  boulder,
  userId,
  competitionId,
  canLog,
  onClose,
}: Props) {
  const { t } = useTranslation('competitions')
  const [shown, setShown] = useState(boulder)
  if (boulder && boulder !== shown) setShown(boulder)

  const wall = useWallImageData(shown?.wallImageId ?? 0)
  const entry = useEntry(userId, competitionId)
  const boulderId = shown?.id ?? 0
  const log = logOf(entry, boulderId)
  const change = (apply: typeof addAttempt) =>
    updateEntry(userId, competitionId, (current) => current && apply(current, boulderId))

  return (
    <Overlay
      open={boulder !== undefined}
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
              holds={shown?.holds ?? []}
              label={t('viewer.photoLabel', { name: shown?.name ?? '' })}
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

      {canLog ? (
        <div className="absolute inset-x-3.5 bottom-[calc(1rem+env(safe-area-inset-bottom))] flex items-end justify-between gap-3">
          <div
            role="group"
            aria-label={t('viewer.attempts')}
            className="flex items-center border-2 border-ink bg-ground"
          >
            <IconButton
              label={t('viewer.less')}
              disabled={log.topped || log.attempts === 0}
              onClick={() => change(removeAttempt)}
              className="size-14 disabled:opacity-40"
            >
              <MinusIcon className="size-7" />
            </IconButton>
            <output
              aria-live="polite"
              aria-label={t('viewer.attempts')}
              className="min-w-12 text-center font-display text-4xl leading-none font-black"
            >
              {log.attempts}
            </output>
            <IconButton
              label={t('viewer.more')}
              disabled={log.topped}
              onClick={() => change(addAttempt)}
              className="size-14 disabled:opacity-40"
            >
              <PlusIcon className="size-7" />
            </IconButton>
          </div>
          <button
            type="button"
            aria-pressed={log.topped}
            onClick={() => change(toggleTop)}
            className={cn(
              'min-h-14 min-w-28 border-2 px-5 font-display text-3xl font-black uppercase',
              'transition-[scale,background-color,color] duration-150 ease-out active:scale-95 motion-reduce:active:scale-100',
              log.topped ? 'border-finish bg-finish text-black' : 'border-ink bg-ground text-ink',
            )}
          >
            {t('viewer.top')}
          </button>
        </div>
      ) : null}
      {canLog && log.topped ? (
        <p className="absolute inset-x-3.5 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] w-fit bg-ground px-2 py-1 text-sm font-semibold">
          {t('viewer.topLocked')}
        </p>
      ) : null}
    </Overlay>
  )
}
