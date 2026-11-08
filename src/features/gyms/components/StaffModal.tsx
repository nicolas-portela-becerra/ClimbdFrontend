import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { GymRole, type GymStaffDto } from '@api'
import { useAddGymStaff, useGymStaff, useRemoveGymStaff } from '@/api/queries/useGymStaff'
import { useToast } from '@/shared/hooks/useToast'
import { apiErrorKind } from '@/shared/lib/apiError'
import { Button } from '@/shared/ui/Button'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { ModalHeader, ModalPanel } from '@/shared/ui/ModalPanel'
import { SelectField } from '@/shared/ui/SelectField'
import { Spinner } from '@/shared/ui/Spinner'
import { TextField } from '@/shared/ui/TextField'

type StaffModalProps = {
  open: boolean
  onClose: () => void
  gymId: number
  // Admins can grant, change and remove the OWNER role; owners only add/remove SETTERs.
  isAdmin: boolean
  // Called after a staff change so the app refreshes the current user's own roles.
  onStaffChanged: () => void
}

// Lists, adds and removes the gym's staff (owners and setters). Owner or admin.
export function StaffModal({ open, onClose, gymId, isAdmin, onStaffChanged }: StaffModalProps) {
  const { t } = useTranslation('gyms')

  return (
    <ModalPanel open={open} label={t('staff.title')}>
      <ModalHeader title={t('staff.title')} closeLabel={t('staff.close')} onClose={onClose} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <StaffContent gymId={gymId} isAdmin={isAdmin} onStaffChanged={onStaffChanged} />
      </div>
    </ModalPanel>
  )
}

function staffErrorKey(error: unknown) {
  switch (apiErrorKind(error)) {
    case 'forbidden':
      return 'staff.errors.forbidden'
    case 'notFound':
      return 'staff.errors.notFound'
    case 'conflict':
      return 'staff.errors.conflict'
    case 'network':
      return 'staff.errors.network'
    case 'invalid':
      return 'staff.errors.invalid'
    default:
      return 'staff.errors.unknown'
  }
}

function StaffContent({
  gymId,
  isAdmin,
  onStaffChanged,
}: {
  gymId: number
  isAdmin: boolean
  onStaffChanged: () => void
}) {
  const { t } = useTranslation('gyms')
  const { showError } = useToast()
  const query = useGymStaff(gymId)
  const add = useAddGymStaff(gymId)
  const remove = useRemoveGymStaff(gymId)

  const [email, setEmail] = useState('')
  const [role, setRole] = useState<GymRole>(GymRole.Setter)
  const [removing, setRemoving] = useState<GymStaffDto | null>(null)

  const submitAdd = async (event: FormEvent) => {
    event.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) {
      showError(t('staff.errors.emailRequired'))
      return
    }
    try {
      await add.mutateAsync({ email: trimmed, role })
      setEmail('')
      onStaffChanged()
    } catch (error) {
      showError(t(staffErrorKey(error)))
    }
  }

  const confirmRemove = () => {
    if (!removing?.userId) return
    remove.mutate(removing.userId, {
      onSuccess: () => {
        setRemoving(null)
        onStaffChanged()
      },
      onError: (error) => {
        setRemoving(null)
        showError(t(staffErrorKey(error)))
      },
    })
  }

  return (
    <div className="px-5 pt-4 pb-8">
      <form onSubmit={(event) => void submitAdd(event)} className="grid gap-3">
        <TextField
          name="email"
          type="email"
          autoComplete="off"
          label={t('staff.email')}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {isAdmin ? (
          <SelectField
            name="role"
            label={t('staff.role')}
            value={role}
            onChange={(event) => setRole(event.target.value as GymRole)}
          >
            <option value={GymRole.Setter}>{t('staff.roleSetter')}</option>
            <option value={GymRole.Owner}>{t('staff.roleOwner')}</option>
          </SelectField>
        ) : null}
        <Button type="submit" variant="primary" loading={add.isPending}>
          {t('staff.submit')}
        </Button>
      </form>

      <div className="mt-6">
        {query.isPending ? (
          <div className="grid place-items-center py-8">
            <Spinner />
          </div>
        ) : query.isError ? (
          <p className="py-4 text-sm font-semibold text-error">{t(staffErrorKey(query.error))}</p>
        ) : (query.data ?? []).length === 0 ? (
          <p className="py-4 text-muted">{t('staff.empty')}</p>
        ) : (
          <ul className="border-t-2 border-ink">
            {(query.data ?? []).map((member) => (
              <StaffRow
                key={member.userId}
                member={member}
                canRemove={isAdmin || member.role === GymRole.Setter}
                onRemove={() => setRemoving(member)}
              />
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={removing !== null}
        title={t('staff.removeTitle')}
        message={t('staff.removeMessage', { name: removing?.name ?? '' })}
        cancelLabel={t('staff.removeCancel')}
        confirmLabel={t('staff.removeConfirm')}
        loading={remove.isPending}
        onCancel={() => setRemoving(null)}
        onConfirm={confirmRemove}
      />
    </div>
  )
}

function StaffRow({
  member,
  canRemove,
  onRemove,
}: {
  member: GymStaffDto
  canRemove: boolean
  onRemove: () => void
}) {
  const { t } = useTranslation('gyms')

  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-3 border-b-2 border-line py-3">
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-cond text-lg leading-tight font-bold uppercase">{member.name}</span>
          <span
            className={
              member.role === GymRole.Owner
                ? 'bg-tape px-1.5 text-xs font-bold tracking-wide text-on-tape uppercase'
                : 'border border-line px-1.5 text-xs font-bold tracking-wide text-muted uppercase'
            }
          >
            {member.role === GymRole.Owner ? t('staff.roleOwner') : t('staff.roleSetter')}
          </span>
        </span>
        <span className="mt-0.5 block text-sm text-muted">{member.email}</span>
      </span>
      {canRemove ? (
        <Button onClick={onRemove} className="min-h-11 w-auto px-3 text-sm">
          {t('staff.remove')}
        </Button>
      ) : null}
    </li>
  )
}
