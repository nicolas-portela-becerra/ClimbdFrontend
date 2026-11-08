import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDeleteGym } from '@/api/queries/useDeleteGym'
import { useToast } from '@/shared/hooks/useToast'
import { apiErrorKind } from '@/shared/lib/apiError'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { DropdownMenu } from '@/shared/ui/DropdownMenu'
import { EditGymModal } from './EditGymModal'
import { StaffModal } from './StaffModal'

type ChangeGymButtonProps = {
  gymId: number
  isAdmin: boolean
  onStaffChanged: () => void
}

// Manage menu of a gym (owner/admin): edit the gym, manage its staff, and — admin only — delete it.
export function ChangeGymButton({ gymId, isAdmin, onStaffChanged }: ChangeGymButtonProps) {
  const { t } = useTranslation('gyms')
  const { showError } = useToast()
  const navigate = useNavigate()
  const remove = useDeleteGym()

  const [editing, setEditing] = useState(false)
  const [staffing, setStaffing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const confirmDelete = () =>
    remove.mutate(gymId, {
      onSuccess: () => void navigate('/gyms'),
      onError: (error) => {
        setDeleting(false)
        showError(apiErrorKind(error) === 'forbidden' ? t('delete.forbidden') : t('delete.failed'))
      },
    })

  return (
    <>
      <DropdownMenu
        label={t('manage.label')}
        items={[
          { label: t('manage.editGym'), onSelect: () => setEditing(true) },
          { label: t('manage.staff'), onSelect: () => setStaffing(true) },
          ...(isAdmin
            ? [
                {
                  label: t('manage.deleteGym'),
                  onSelect: () => setDeleting(true),
                  destructive: true,
                },
              ]
            : []),
        ]}
      />
      <EditGymModal open={editing} onClose={() => setEditing(false)} gymId={gymId} />
      <StaffModal
        open={staffing}
        onClose={() => setStaffing(false)}
        gymId={gymId}
        isAdmin={isAdmin}
        onStaffChanged={onStaffChanged}
      />
      <ConfirmDialog
        open={deleting}
        title={t('delete.title')}
        message={t('delete.message')}
        cancelLabel={t('delete.cancel')}
        confirmLabel={t('delete.confirm')}
        loading={remove.isPending}
        onCancel={() => setDeleting(false)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
