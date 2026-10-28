import { useActionState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { WallImageSummary } from '@api'
import { useUpdateWallImage } from '@/api/queries/useUpdateWallImage'
import { useWallImageData } from '@/api/queries/useWallImageBlob'
import { Button } from '@/shared/ui/Button'
import { ModalHeader, ModalPanel } from '@/shared/ui/ModalPanel'
import { TextField } from '@/shared/ui/TextField'
import { editErrorKey, validateWallName, type UploadFormState } from '../actions'
import { validatePhoto } from '../photo'
import { PhotoPicker } from './PhotoPicker'

type EditWallModalProps = {
  open: boolean
  onClose: () => void
  wall: WallImageSummary
  gymId: number
}

// Change the name of a wall and, optionally, its photo.
export function EditWallModal({ open, onClose, wall, gymId }: EditWallModalProps) {
  const { t } = useTranslation('walls')

  return (
    <ModalPanel open={open} label={t('edit.title')}>
      <ModalHeader title={t('edit.title')} closeLabel={t('upload.close')} onClose={onClose} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <EditForm wall={wall} gymId={gymId} onSaved={onClose} />
      </div>
    </ModalPanel>
  )
}

function EditForm({
  wall,
  gymId,
  onSaved,
}: {
  wall: WallImageSummary
  gymId: number
  onSaved: () => void
}) {
  const { t } = useTranslation('walls')
  const update = useUpdateWallImage(gymId)
  const current = useWallImageData(wall.id ?? 0)
  const photo = useRef<File | null>(null)
  const initial: UploadFormState = {
    ok: false,
    fieldErrors: {},
    values: { name: wall.wallName ?? '' },
  }

  const submit = async (_previous: UploadFormState, data: FormData): Promise<UploadFormState> => {
    const rawName = data.get('name')
    const name = (typeof rawName === 'string' ? rawName : '').trim()
    const values = { name }
    const file = photo.current

    const fieldErrors: UploadFormState['fieldErrors'] = {}
    const nameError = validateWallName(name)
    if (nameError) fieldErrors.name = nameError
    const photoError = file ? validatePhoto(file) : null
    if (photoError) fieldErrors.photo = photoError
    if (Object.keys(fieldErrors).length > 0 || wall.id === undefined) {
      return { ok: false, fieldErrors, values }
    }

    try {
      await update.mutateAsync({
        wallImageId: wall.id,
        wallName: name,
        ...(file ? { image: file } : {}),
      })
      onSaved()
      return { ok: true, fieldErrors: {}, values }
    } catch (error) {
      return { ok: false, fieldErrors: {}, formError: editErrorKey(error), values }
    }
  }

  const [state, action, pending] = useActionState(submit, initial)

  return (
    <form action={action} noValidate className="grid gap-4 px-5 pt-4 pb-8">
      {state.formError ? (
        <p role="alert" className="border-2 border-error bg-surface p-3 font-semibold">
          {t(state.formError)}
        </p>
      ) : null}
      <PhotoPicker
        current={current.data?.blob}
        onChange={(file) => {
          photo.current = file
        }}
        error={state.fieldErrors.photo ? t(state.fieldErrors.photo) : undefined}
      />
      <TextField
        name="name"
        autoComplete="off"
        label={t('upload.name')}
        defaultValue={state.values.name}
        error={state.fieldErrors.name ? t(state.fieldErrors.name) : undefined}
      />
      <Button type="submit" variant="primary" loading={pending} className="mt-2">
        {t('edit.submit')}
      </Button>
    </form>
  )
}
