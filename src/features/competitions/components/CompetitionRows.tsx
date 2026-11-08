import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useActiveCompetitions } from '@/api/queries/useActiveCompetitions'
import { useGym } from '@/api/queries/useGym'
import { ChevronIcon } from '@/shared/icons'
import { cn } from '@/shared/lib/cn'
import { formatDateTime } from '@/shared/lib/timezone'
import { listEntries, updateEntry } from '../entryStore'
import { phaseOf } from '../phase'
import { emptyEntry } from '../results'
import { toSaved } from '../toSaved'

// One row per active competition of the gym, above the walls. It only shows what the active endpoint
// returns; the phone no longer keeps a competition row after the server stops listing it.
export function CompetitionRows({ gymId, userId }: { gymId: number; userId: number }) {
  const { t, i18n } = useTranslation('competitions')
  const query = useActiveCompetitions(gymId)
  const gym = useGym(gymId)

  const active = (query.data ?? []).flatMap((announcement) => {
    const competition = toSaved(announcement, gymId)
    return competition ? [{ competition, registered: announcement.registered ?? false }] : []
  })

  // While the competition is active, the phone stores the user's data (logs, boulders, send state).
  // When the server stops returning a competition, the saved entry for this gym is removed.
  useEffect(() => {
    const activeIds = new Set(active.map((row) => row.competition.id))
    for (const entry of listEntries(userId)) {
      if (entry.competition.gymId === gymId && !activeIds.has(entry.competition.id)) {
        updateEntry(userId, entry.competition.id, () => undefined)
      }
    }
    // Also refresh the active rows' stored copy (still active).
    for (const row of active) {
      if (!row.registered) continue
      updateEntry(userId, row.competition.id, (current) =>
        current ? { ...current, competition: row.competition } : emptyEntry(row.competition),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, userId, gymId])

  const rows = active.sort(
    (a, b) => Date.parse(a.competition.dateFrom) - Date.parse(b.competition.dateFrom),
  )
  if (rows.length === 0) return null

  return (
    <ul aria-label={t('rows.label')} className="grid gap-3 px-5 pb-4">
      {rows.map(({ competition, registered }) => {
        const phase = phaseOf(competition, undefined)
        return (
          <li key={competition.id}>
            <Link
              to={`/gyms/${gymId}/competitions/${competition.id}`}
              className="grid grid-cols-[1fr_auto] items-center gap-3 border-2 border-ink bg-surface px-4 py-3 active:bg-raised"
            >
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2 font-cond text-sm font-bold tracking-wide uppercase">
                  <span
                    className={cn(
                      'px-1.5',
                      phase === 'upcoming' && 'bg-tape text-on-tape',
                      (phase === 'running' || phase === 'grace') && 'bg-ink text-ground',
                      phase === 'ended' && 'border-2 border-line text-muted',
                    )}
                  >
                    {t(`phase.${phase}`)}
                  </span>
                  {registered ? <span className="text-muted">{t('rows.registered')}</span> : null}
                </span>
                <span className="mt-1 block font-display text-3xl leading-none font-extrabold uppercase">
                  {competition.name}
                </span>
                <span className="mt-1 block text-sm text-muted">
                  {formatDateTime(competition.dateFrom, i18n.language, gym.data?.timeZone)} –{' '}
                  {formatDateTime(competition.dateTo, i18n.language, gym.data?.timeZone)}
                </span>
                {phase === 'upcoming' && !registered ? (
                  <span className="mt-1 block text-sm font-semibold">
                    {t('rows.tapToRegister')}
                  </span>
                ) : null}
              </span>
              <ChevronIcon className="size-6" />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
