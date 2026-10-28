import { useTranslation } from 'react-i18next'
import { useBoulder } from '@/api/queries/useBoulder'
import { useUpdateBoulder } from '@/api/queries/useUpdateBoulder'
import { useToast } from '@/shared/hooks/useToast'
import { ErrorState } from '@/shared/ui/ErrorState'
import { ModalHeader, ModalPanel } from '@/shared/ui/ModalPanel'
import { Spinner } from '@/shared/ui/Spinner'
import { holdsFromDto, toUpdateHoldPayload } from '../useHoldEditor'
import { BoulderFlow } from './BoulderFlow'

type EditBoulderModalProps = {
  open: boolean
  onClose: () => void
  boulderId: number
  gymId: number
  wallImageId: number
  userId: number
}

// The same modal as creating a boulder, opened with the boulder's holds and details already filled.
export function EditBoulderModal({ open, onClose, ...rest }: EditBoulderModalProps) {
  const { t } = useTranslation(['editor', 'common'])

  return (
    <ModalPanel open={open} label={t('edit.title')}>
      <EditBoulderContent onClose={onClose} {...rest} />
    </ModalPanel>
  )
}

function EditBoulderContent({
  boulderId,
  gymId,
  wallImageId,
  userId,
  onClose,
}: Omit<EditBoulderModalProps, 'open'>) {
  const { t } = useTranslation(['editor', 'common'])
  const { showError } = useToast()
  const boulder = useBoulder(boulderId)
  const update = useUpdateBoulder(wallImageId)

  if (!boulder.data) {
    return (
      <>
        <ModalHeader title={t('edit.title')} closeLabel={t('close')} onClose={onClose} />
        {boulder.isError ? (
          <ErrorState
            title={t('common:error.title')}
            message={t('common:error.message')}
            action={{ label: t('common:error.retry'), onClick: () => void boulder.refetch() }}
          />
        ) : (
          <div className="grid place-items-center py-16">
            <Spinner />
          </div>
        )}
      </>
    )
  }

  return (
    <BoulderFlow
      title={t('edit.title')}
      submitLabel={t('edit.submit')}
      wallImageId={wallImageId}
      onClose={onClose}
      initialHolds={holdsFromDto(boulder.data.holds ?? [])}
      initialDetails={{
        name: boulder.data.name ?? '',
        grade: boulder.data.grade ?? '',
        description: boulder.data.description ?? '',
      }}
      onForbidden={() => showError(t('edit.forbidden'))}
      onSubmit={async (holds, { name, grade, description }) => {
        await update.mutateAsync({
          boulderId,
          name,
          grade,
          description,
          creatorId: userId,
          gymId: boulder.data?.gymId ?? gymId,
          wallImageId: boulder.data?.wallImageId ?? wallImageId,
          holds: holds.map((hold) => toUpdateHoldPayload(hold, boulderId)),
        })
      }}
    />
  )
}
