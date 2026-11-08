import { useTranslation } from 'react-i18next'
import type { CompetitionBoulderDto } from '@api'
import {
  useCreateCompetitionBoulder,
  useUpdateCompetitionBoulder,
} from '@/api/queries/useCompetitionBoulderMutations'
import { ModalPanel } from '@/shared/ui/ModalPanel'
import type { BoulderDetails } from '../actions'
import { holdsFromDto, toCreateHoldPayload, type EditorHold } from '../useHoldEditor'
import { BoulderFlow } from './BoulderFlow'

type CompetitionBoulderModalProps = {
  open: boolean
  onClose: () => void
  competitionId: number
  wallImageId: number
  withPoints: boolean
  // Editing this boulder; creating a new one when missing.
  boulder?: CompetitionBoulderDto
}

// The same two-step editor as normal boulders, saving to the competition endpoints.
export function CompetitionBoulderModal({ open, ...props }: CompetitionBoulderModalProps) {
  const { t } = useTranslation('editor')
  const title = props.boulder ? t('competition.editTitle') : t('competition.createTitle')

  return (
    <ModalPanel open={open} label={title}>
      <CompetitionBoulderContent title={title} {...props} />
    </ModalPanel>
  )
}

function CompetitionBoulderContent({
  title,
  onClose,
  competitionId,
  wallImageId,
  withPoints,
  boulder,
}: Omit<CompetitionBoulderModalProps, 'open'> & { title: string }) {
  const { t } = useTranslation('editor')
  const create = useCreateCompetitionBoulder(competitionId)
  const update = useUpdateCompetitionBoulder(competitionId)

  const save = async (holds: EditorHold[], details: BoulderDetails) => {
    const request = {
      name: details.name,
      grade: details.grade,
      wallImageId,
      holds: holds.map(toCreateHoldPayload),
      ...(details.description ? { description: details.description } : {}),
      ...(withPoints && details.points ? { points: Number(details.points) } : {}),
    }
    if (boulder?.id !== undefined) await update.mutateAsync({ boulderId: boulder.id, request })
    else await create.mutateAsync(request)
  }

  return (
    <BoulderFlow
      title={title}
      submitLabel={boulder ? t('edit.submit') : t('details.submit')}
      wallImageId={wallImageId}
      onClose={onClose}
      onSubmit={save}
      withPoints={withPoints}
      {...(boulder
        ? {
            initialHolds: holdsFromDto(boulder.holds ?? []),
            initialDetails: {
              name: boulder.name ?? '',
              grade: boulder.grade ?? '',
              description: boulder.description ?? '',
              ...(withPoints ? { points: String(boulder.points ?? '') } : {}),
            },
          }
        : withPoints
          ? { initialDetails: { name: '', grade: '', description: '', points: '' } }
          : {})}
    />
  )
}
