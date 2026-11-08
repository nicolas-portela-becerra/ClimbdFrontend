import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CompetitionSection, Gender } from '@api'
import { useActiveCompetitions } from '@/api/queries/useActiveCompetitions'
import { useCompetitionRanking } from '@/api/queries/useCompetitionRanking'
import { BackIcon } from '@/shared/icons'
import { apiErrorKind } from '@/shared/lib/apiError'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { ErrorState } from '@/shared/ui/ErrorState'
import { SelectField } from '@/shared/ui/SelectField'
import { Spinner } from '@/shared/ui/Spinner'
import { ALL, computeRanking, type RankingRow } from '../ranking'
import { toSaved } from '../toSaved'

type RankingScreenProps = { gymId: number; competitionId: number; userId: number }

// The competition's results: the server's ranking, filtered and re-ranked by the chosen group.
export function RankingScreen({ gymId, competitionId }: Omit<RankingScreenProps, 'userId'>) {
  const { t } = useTranslation(['competitions', 'common'])
  const location = useLocation()
  const navigate = useNavigate()
  const active = useActiveCompetitions(gymId)
  const ranking = useCompetitionRanking(competitionId)

  const [gender, setGender] = useState<Gender | typeof ALL>(ALL)
  const [section, setSection] = useState<CompetitionSection | typeof ALL>(ALL)

  const announcement = active.data?.find((item) => item.id === competitionId)
  const competition = announcement && toSaved(announcement, gymId)
  const forbidden = ranking.isError && apiErrorKind(ranking.error) === 'forbidden'
  const rows = ranking.data ? computeRanking(ranking.data, { gender, section }) : []

  if (!competition) {
    if (active.isPending) {
      return (
        <div className="grid place-items-center py-16">
          <Spinner />
        </div>
      )
    }
    return (
      <ErrorState
        title={t('screen.notFound.title')}
        message={t('screen.notFound.message')}
        action={{ label: t('screen.back'), onClick: () => void navigate(`/gyms/${gymId}`) }}
      />
    )
  }

  const goBack = () => {
    if (location.key !== 'default') void navigate(-1)
    else void navigate(`/gyms/${gymId}`, { replace: true })
  }

  return (
    <>
      <header className="flex items-center gap-1 px-2 pt-5 pb-2">
        <Link
          to={`/gyms/${gymId}/competitions/${competitionId}`}
          aria-label={t('ranking.back')}
          className="grid size-11 shrink-0 place-items-center"
        >
          <BackIcon className="size-6" />
        </Link>
        <h1 className="min-w-0 font-display text-4xl leading-none font-extrabold uppercase">
          {competition?.name ?? t('ranking.title')}
        </h1>
      </header>
      <p className="px-5 pb-4 font-cond text-sm font-semibold tracking-wide text-muted uppercase">
        {t('ranking.subtitle')}
      </p>

      <div className="grid grid-cols-2 gap-3 px-5 pb-4">
        <SelectField
          name="rankingGender"
          label={t('ranking.filtersGender')}
          value={gender}
          onChange={(event) => setGender(event.target.value as Gender | typeof ALL)}
        >
          <option value={ALL}>{t('ranking.genderAll')}</option>
          {Object.values(Gender).map((value) => (
            <option key={value} value={value}>
              {t(`ranking.gender.${value}`)}
            </option>
          ))}
        </SelectField>
        <SelectField
          name="rankingSection"
          label={t('ranking.filtersSection')}
          value={section}
          onChange={(event) => setSection(event.target.value as CompetitionSection | typeof ALL)}
        >
          <option value={ALL}>{t('ranking.sectionAll')}</option>
          {Object.values(CompetitionSection).map((value) => (
            <option key={value} value={value}>
              {t(`section.${value}`)}
            </option>
          ))}
        </SelectField>
      </div>

      {!forbidden ? (
        <RankingTable
          rows={rows}
          showGender={gender === ALL}
          showSection={section === ALL}
          loading={ranking.isPending}
          failed={!forbidden && ranking.isError}
          onRetry={() => void ranking.refetch()}
          emptyTitle={ranking.data && ranking.data.length === 0 ? t('ranking.notReady') : null}
        />
      ) : null}

      {/* Only admins and the gym's owner get the ranking: everyone else gets this pop-up, which they
          must close, and then go back to the competition. */}
      <ConfirmDialog
        open={forbidden}
        title={t('ranking.staffTitle')}
        message={t('ranking.staffMessage')}
        confirmLabel={t('ranking.close')}
        onCancel={goBack}
        onConfirm={goBack}
        destructive={false}
      />
    </>
  )
}

type RankingTableProps = {
  rows: RankingRow[]
  showGender: boolean
  showSection: boolean
  loading: boolean
  failed: boolean
  emptyTitle: string | null
  onRetry: () => void
}

function RankingTable({
  rows,
  showGender,
  showSection,
  loading,
  failed,
  emptyTitle,
  onRetry,
}: RankingTableProps) {
  const { t } = useTranslation(['competitions', 'common'])

  if (loading) {
    return (
      <div className="grid place-items-center py-16">
        <Spinner />
      </div>
    )
  }
  if (failed) {
    return (
      <ErrorState
        title={t('screen.loadError')}
        message={t('common:error.message')}
        action={{ label: t('common:error.retry'), onClick: onRetry }}
      />
    )
  }
  if (emptyTitle) {
    return (
      <p className="mx-5 border-2 border-dashed border-line px-4 py-6 text-center font-semibold">
        {emptyTitle}
      </p>
    )
  }

  return (
    <table className="w-full border-t-2 border-ink text-left">
      <thead>
        <tr className="font-cond text-sm tracking-wide text-muted uppercase">
          <th scope="col" className="py-2 pr-2 pl-5 font-semibold">
            {t('ranking.pos')}
          </th>
          <th scope="col" className="py-2 pr-2 font-semibold">
            {t('ranking.name')}
          </th>
          <th scope="col" className="py-2 pr-2 text-right font-semibold">
            {t('ranking.pts')}
          </th>
          <th scope="col" className="py-2 pr-2 text-right font-semibold">
            {t('ranking.attempts')}
          </th>
          <th scope="col" className="py-2 pr-5 text-right font-semibold">
            {t('ranking.firstTops')}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={`${row.rank}-${row.name}-${index}`} className="border-t-2 border-line align-top">
            <td className="py-3 pr-2 pl-5">
              <span className="font-display text-2xl leading-none font-extrabold">{row.rank}</span>
            </td>
            <td className="py-3 pr-2">
              <span className="block font-cond text-lg leading-tight font-bold uppercase">
                {row.name}
              </span>
              <span className="block text-sm text-muted">
                {[
                  ...(showSection && row.section ? [t(`section.${row.section}`)] : []),
                  ...(showGender && row.gender ? [t(`ranking.gender.${row.gender}`)] : []),
                ].join(' · ') || ' '}
              </span>
            </td>
            <td className="py-3 pr-2 text-right font-display text-xl font-extrabold">
              {row.totalPoints}
            </td>
            <td className="py-3 pr-2 text-right">{row.totalAttempts}</td>
            <td className="py-3 pr-5 text-right">{row.flashTops}</td>
          </tr>
        ))}
        {rows.length === 0 ? (
          <tr>
            <td colSpan={5} className="py-6 text-center text-muted">
              {t('ranking.empty')}
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  )
}
