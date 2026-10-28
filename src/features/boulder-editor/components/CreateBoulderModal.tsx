import { useTranslation } from 'react-i18next'
import { useCreateBoulder } from '@/api/queries/useCreateBoulder'
import { ModalPanel } from '@/shared/ui/ModalPanel'
import { toCreateHoldPayload } from '../useHoldEditor'
import { BoulderFlow } from './BoulderFlow'

type CreateBoulderModalProps = {
  open: boolean
  onClose: () => void
  gymId: number
  wallImageId: number
  userId: number
}

export function CreateBoulderModal({
  open,
  onClose,
  gymId,
  wallImageId,
  userId,
}: CreateBoulderModalProps) {
  const { t } = useTranslation('editor')
  const create = useCreateBoulder(gymId)

  return (
    <ModalPanel open={open} label={t('title')}>
      <BoulderFlow
        title={t('title')}
        submitLabel={t('details.submit')}
        wallImageId={wallImageId}
        onClose={onClose}
        onSubmit={async (holds, { name, grade, description }) => {
          await create.mutateAsync({
            name,
            grade,
            wallImageId,
            createdBy: userId,
            holds: holds.map(toCreateHoldPayload),
            ...(description ? { description } : {}),
          })
        }}
      />
    </ModalPanel>
  )
}
