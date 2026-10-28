import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { BoulderResponseDto } from '@api'
import { useDeleteBoulder } from '@/api/queries/useDeleteBoulder'
import { useToast } from '@/shared/hooks/useToast'
import { apiErrorKind } from '@/shared/lib/apiError'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { DropdownMenu } from '@/shared/ui/DropdownMenu'
import { EditBoulderModal } from './EditBoulderModal'

type BoulderMenuProps = {
  boulder: BoulderResponseDto
  gymId: number
  wallImageId: number
  userId: number
}

// Three-dots menu of a boulder row: edit it (same modal as creating) or delete it (with confirmation).
export function BoulderMenu({ boulder, gymId, wallImageId, userId }: BoulderMenuProps) {
  const { t } = useTranslation('editor')
  const { showError } = useToast()
  const remove = useDeleteBoulder(wallImageId)
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)

  if (boulder.id === undefined) return null
  const boulderId = boulder.id

  const confirmDelete = () =>
    remove.mutate(boulderId, {
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
        items={[
          { label: t('menu.edit'), onSelect: () => setEditing(true) },
          { label: t('menu.delete'), onSelect: () => setConfirming(true), destructive: true },
        ]}
      />
      <EditBoulderModal
        open={editing}
        onClose={() => setEditing(false)}
        boulderId={boulderId}
        gymId={gymId}
        wallImageId={wallImageId}
        userId={userId}
      />
      <ConfirmDialog
        open={confirming}
        title={t('delete.title')}
        message={t('delete.message', { name: boulder.name ?? '' })}
        cancelLabel={t('delete.cancel')}
        confirmLabel={t('delete.confirm')}
        loading={remove.isPending}
        onCancel={() => setConfirming(false)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
