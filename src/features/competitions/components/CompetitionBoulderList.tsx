import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CompetitionType, type CompetitionBoulderDto } from '@api'
import { cn } from '@/shared/lib/cn'
import { GradeTape } from '@/shared/ui/GradeTape'
import { useEntry } from '../entryStore'
import { logOf } from '../results'

type Props = {
  boulders: CompetitionBoulderDto[]
  type: string
  userId: number
  competitionId: number
  // Show the user's attempts and tops (registered users).
  showLogs: boolean
  renderActions?: ((boulder: CompetitionBoulderDto) => ReactNode) | undefined
}

export function CompetitionBoulderList({
  boulders,
  type,
  userId,
  competitionId,
  showLogs,
  renderActions,
}: Props) {
  const { t } = useTranslation('competitions')
  const entry = useEntry(userId, competitionId)

  return (
    <ul aria-label={t('screen.boulders')} className="border-t-2 border-ink px-5">
      {boulders.map((boulder) => {
        const log = logOf(entry, boulder.id ?? 0)
        const actions = renderActions?.(boulder)
        return (
          <li key={boulder.id} className="relative border-b-2 border-line">
            <Link
              to={`?boulder=${boulder.id}`}
              preventScrollReset
              className={cn(
                'grid min-h-16 grid-cols-[5.5rem_1fr] items-center gap-3 py-3.5 active:bg-surface',
                actions && 'pr-11',
              )}
            >
              <GradeTape grade={boulder.grade ?? ''} />
              <span className="min-w-0">
                <span className="block font-cond text-xl leading-tight font-bold uppercase">
                  {boulder.name}
                </span>
                <span className="mt-0.5 flex flex-wrap gap-x-3 text-sm text-muted">
                  {type === CompetitionType.AllOrNothing && boulder.points != null ? (
                    <span>{t('screen.points', { count: boulder.points })}</span>
                  ) : null}
                  {showLogs ? (
                    <span className={cn(log.topped && 'font-bold text-ink')}>
                      {log.attempts === 0
                        ? t('screen.notTried')
                        : t('screen.attempts', { count: log.attempts })}
                      {log.topped ? ` · ${t('screen.top')}` : ''}
                    </span>
                  ) : null}
                </span>
              </span>
            </Link>
            {actions ? (
              <div className="absolute inset-y-0 right-0 flex items-center">{actions}</div>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
