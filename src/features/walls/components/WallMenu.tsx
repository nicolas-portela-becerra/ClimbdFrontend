import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { WallImageSummary } from '@api'
import { useDeleteWallImage } from '@/api/queries/useDeleteWallImage'
import { useToast } from '@/shared/hooks/useToast'
import { apiErrorKind } from '@/shared/lib/apiError'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { DropdownMenu } from '@/shared/ui/DropdownMenu'
import { EditWallModal } from './EditWallModal'

// Three-dots menu of a wall card: edit it (name and photo) or delete it (with confirmation).
type WallMenuProps = { wall: WallImageSummary; gymId: number; className?: string }

export function WallMenu({ wall, gymId, className }: WallMenuProps) {
  const { t } = useTranslation('walls')
  const { showError } = useToast()
  const remove = useDeleteWallImage(gymId)
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)

  if (wall.id === undefined) return null
  const wallId = wall.id

  const confirmDelete = () =>
    remove.mutate(wallId, {
      onSuccess: () => setConfirming(false),
      onError: (error) => {
        setConfirming(false)
        showError(apiErrorKind(error) === 'forbidden' ? t('delete.forbidden') : t('delete.failed'))
      },
    })

  return (
    <>
      <DropdownMenu
        label={t('menu.label')}
        {...(className ? { className } : {})}
        buttonClassName="bg-ground"
        items={[
          { label: t('menu.edit'), onSelect: () => setEditing(true) },
          { label: t('menu.delete'), onSelect: () => setConfirming(true), destructive: true },
        ]}
      />
      <EditWallModal open={editing} onClose={() => setEditing(false)} wall={wall} gymId={gymId} />
      <ConfirmDialog
        open={confirming}
        title={t('delete.title')}
        message={t('delete.message', { name: wall.wallName ?? '' })}
        cancelLabel={t('delete.cancel')}
        confirmLabel={t('delete.confirm')}
        loading={remove.isPending}
        onCancel={() => setConfirming(false)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
