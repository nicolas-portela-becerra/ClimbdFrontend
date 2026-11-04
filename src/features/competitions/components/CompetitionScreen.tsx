import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { CompetitionType, type CompetitionBoulderDto } from '@api'
import { useActiveCompetitions } from '@/api/queries/useActiveCompetitions'
import { useCompetitionBoulders } from '@/api/queries/useCompetitionBoulders'
import { useMyCompetitionStatus } from '@/api/queries/useMyCompetitionStatus'
import { BackIcon, PlusIcon } from '@/shared/icons'
import { apiErrorKind } from '@/shared/lib/apiError'
import { Button } from '@/shared/ui/Button'
import { ErrorState } from '@/shared/ui/ErrorState'
import { Spinner } from '@/shared/ui/Spinner'
import type { RenderCompetitionBoulderEditor } from '../editorSlot'
import { updateEntry, useEntry } from '../entryStore'
import { formatDateTime, phaseOf } from '../phase'
import { applyServerStatus, emptyEntry } from '../results'
import { toSaved } from '../toSaved'
import { CompetitionBoulderList } from './CompetitionBoulderList'
import { CompetitionBoulderMenu } from './CompetitionBoulderMenu'
import { CompetitionBoulderViewer } from './CompetitionBoulderViewer'
import { RegistrationPanel } from './RegistrationPanel'
import { SendResultsButton, SendStatus } from './SendResults'
import { WallPickerModal } from './WallPickerModal'

type CompetitionScreenProps = {
  gymId: number
  competitionId: number
  userId: number
  renderBoulderEditor: RenderCompetitionBoulderEditor
}

type EditorTarget = { wallImageId: number; boulder?: CompetitionBoulderDto }

export function CompetitionScreen({
  gymId,
  competitionId,
  userId,
  renderBoulderEditor,
}: CompetitionScreenProps) {
  const { t, i18n } = useTranslation(['competitions', 'common'])
  const location = useLocation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const active = useActiveCompetitions(gymId)
  const entry = useEntry(userId, competitionId)

  const announcement = active.data?.find((item) => item.id === competitionId)
  const competition = (announcement && toSaved(announcement, gymId)) ?? entry?.competition
  // The phone only keeps data for competitions the user registered in.
  const registered = announcement ? (announcement.registered ?? false) : entry !== undefined

  const me = useMyCompetitionStatus(competitionId, registered)
  const boulders = useCompetitionBoulders(competitionId)

  const [picking, setPicking] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editor, setEditor] = useState<EditorTarget | null>(null)

  // Keeps the competition, what the server stored and the boulders on the phone.
  useEffect(() => {
    if (!registered || !competition) return
    updateEntry(userId, competitionId, (current) => {
      let next = current ? { ...current, competition } : emptyEntry(competition)
      if (me.data) next = applyServerStatus(next, me.data)
      if (boulders.data) next = { ...next, boulders: boulders.data }
      return next
    })
    // `competition` is rebuilt every render from the same data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registered, announcement, me.data, boulders.data, userId, competitionId])

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

  const phase = phaseOf(competition, entry)
  const started = phase !== 'upcoming'
  const canLog = registered && (phase === 'running' || phase === 'grace')
  const list = boulders.data ?? entry?.boulders
  const forbidden = boulders.isError && apiErrorKind(boulders.error) === 'forbidden'

  const requested = Number(params.get('boulder'))
  const selected = list?.find((boulder) => boulder.id === requested)
  const closeBoulder = () => {
    if (location.key !== 'default') void navigate(-1)
    else void navigate(`/gyms/${gymId}/competitions/${competitionId}`, { replace: true })
  }

  const openEditor = (target: EditorTarget) => {
    setEditor(target)
    setEditorOpen(true)
  }

  let content
  if (list) {
    content =
      list.length === 0 ? (
        <p className="px-5 py-8 text-muted">{t('screen.noBoulders')}</p>
      ) : (
        <CompetitionBoulderList
          boulders={list}
          type={competition.type}
          userId={userId}
          competitionId={competitionId}
          showLogs={registered && started}
          renderActions={
            started
              ? undefined
              : (boulder) => (
                  <CompetitionBoulderMenu
                    boulder={boulder}
                    competitionId={competitionId}
                    onEdit={() => openEditor({ wallImageId: boulder.wallImageId ?? 0, boulder })}
                  />
                )
          }
        />
      )
  } else if (boulders.isPending) {
    content = (
      <div className="grid place-items-center py-16">
        <Spinner />
      </div>
    )
  } else if (forbidden) {
    content = (
      <p className="mx-5 border-2 border-dashed border-line px-4 py-6 text-center font-semibold">
        {started ? t('screen.noData') : t('screen.hidden')}
      </p>
    )
  } else {
    content = (
      <ErrorState
        title={t('screen.loadError')}
        message={t('common:error.message')}
        action={{ label: t('common:error.retry'), onClick: () => void boulders.refetch() }}
      />
    )
  }

  return (
    <>
      <header className="flex items-center gap-1 px-2 pt-5 pb-2">
        <Link
          to={`/gyms/${gymId}`}
          aria-label={t('screen.back')}
          className="grid size-11 shrink-0 place-items-center"
        >
          <BackIcon className="size-6" />
        </Link>
        <h1 className="min-w-0 font-display text-4xl leading-none font-extrabold uppercase">
          {competition.name}
        </h1>
        {registered && started ? (
          <div className="ml-auto shrink-0 pr-3">
            <SendResultsButton userId={userId} competitionId={competitionId} canSend={canLog} />
          </div>
        ) : null}
      </header>
      <p className="px-5 pb-2 font-cond text-sm font-semibold tracking-wide text-muted uppercase">
        {t(`phase.${phase}`)} · {t(`type.${competition.type as CompetitionType}`)}
      </p>
      <p className="px-5 pb-3 text-sm text-muted">
        {formatDateTime(competition.dateFrom, i18n.language)} –{' '}
        {formatDateTime(competition.dateTo, i18n.language)}
      </p>

      {registered && started ? <SendStatus userId={userId} competitionId={competitionId} /> : null}
      {!started ? (
        <RegistrationPanel
          gymId={gymId}
          userId={userId}
          competitionId={competitionId}
          registered={registered}
          section={me.data?.section}
        />
      ) : null}
      {!registered && started ? (
        <p className="mx-5 mb-4 border-2 border-line px-4 py-3 text-sm font-semibold">
          {t('screen.viewOnly')}
        </p>
      ) : null}
      {!started ? (
        <div className="px-5 pb-4">
          <Button onClick={() => setPicking(true)}>
            <PlusIcon className="size-5" />
            {t('organiser.addBoulder')}
          </Button>
        </div>
      ) : null}

      {content}

      <CompetitionBoulderViewer
        boulder={selected}
        userId={userId}
        competitionId={competitionId}
        canLog={canLog}
        onClose={closeBoulder}
      />
      <WallPickerModal
        open={picking}
        onClose={() => setPicking(false)}
        gymId={gymId}
        onPick={(wallImageId) => {
          setPicking(false)
          openEditor({ wallImageId })
        }}
      />
      {editor
        ? renderBoulderEditor({
            open: editorOpen,
            onClose: () => setEditorOpen(false),
            competitionId,
            wallImageId: editor.wallImageId,
            withPoints: competition.type === CompetitionType.AllOrNothing,
            ...(editor.boulder ? { boulder: editor.boulder } : {}),
          })
        : null}
    </>
  )
}
