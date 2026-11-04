import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useActiveCompetitions } from '@/api/queries/useActiveCompetitions'
import { ChevronIcon } from '@/shared/icons'
import { cn } from '@/shared/lib/cn'
import { listEntries, updateEntry, useEntriesVersion } from '../entryStore'
import { formatDateTime, phaseOf } from '../phase'
import { emptyEntry, type SavedCompetition } from '../results'
import { toSaved } from '../toSaved'

type Row = { competition: SavedCompetition; registered: boolean }

// One row per competition of the gym, above the walls: the server's upcoming and running ones, plus the
// ones this phone still has data for (after they end the server stops listing them).
export function CompetitionRows({ gymId, userId }: { gymId: number; userId: number }) {
  const { t, i18n } = useTranslation('competitions')
  const query = useActiveCompetitions(gymId)
  useEntriesVersion()

  const active = (query.data ?? []).flatMap((announcement) => {
    const competition = toSaved(announcement, gymId)
    return competition ? [{ competition, registered: announcement.registered ?? false }] : []
  })

  // A registered user keeps the competition on the phone, so its row survives the end.
  useEffect(() => {
    for (const row of active) {
      if (!row.registered) continue
      updateEntry(userId, row.competition.id, (current) =>
        current ? { ...current, competition: row.competition } : emptyEntry(row.competition),
      )
    }
    // `active` is rebuilt every render; the data behind it is query.data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, userId])

  const saved: Row[] = listEntries(userId)
    .filter((entry) => entry.competition.gymId === gymId)
    .filter((entry) => !active.some((row) => row.competition.id === entry.competition.id))
    .map((entry) => ({ competition: entry.competition, registered: true }))

  const rows = [...active, ...saved].sort(
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
                  {formatDateTime(competition.dateFrom, i18n.language)} –{' '}
                  {formatDateTime(competition.dateTo, i18n.language)}
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
