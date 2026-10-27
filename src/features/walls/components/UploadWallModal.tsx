import { useActionState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useUploadWallImage } from '@/api/queries/useUploadWallImage'
import { Button } from '@/shared/ui/Button'
import { ModalHeader, ModalPanel } from '@/shared/ui/ModalPanel'
import { TextField } from '@/shared/ui/TextField'
import {
  initialUploadState,
  uploadErrorKey,
  validateWallName,
  type UploadFormState,
} from '../actions'
import { validatePhoto } from '../photo'
import { PhotoPicker } from './PhotoPicker'

type UploadWallModalProps = {
  open: boolean
  onClose: () => void
  gymId: number
  userId: number
}

export function UploadWallModal({ open, onClose, ...ids }: UploadWallModalProps) {
  const { t } = useTranslation('walls')

  return (
    <ModalPanel open={open} label={t('upload.title')}>
      <ModalHeader title={t('upload.title')} closeLabel={t('upload.close')} onClose={onClose} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <UploadForm onUploaded={onClose} {...ids} />
      </div>
    </ModalPanel>
  )
}

function UploadForm({
  gymId,
  userId,
  onUploaded,
}: Omit<UploadWallModalProps, 'open' | 'onClose'> & { onUploaded: () => void }) {
  const { t } = useTranslation('walls')
  const upload = useUploadWallImage(gymId)
  const photo = useRef<File | null>(null)

  const submit = async (_previous: UploadFormState, data: FormData): Promise<UploadFormState> => {
    const rawName = data.get('name')
    const name = (typeof rawName === 'string' ? rawName : '').trim()
    const values = { name }
    const file = photo.current

    const fieldErrors: UploadFormState['fieldErrors'] = {}
    const nameError = validateWallName(name)
    if (nameError) fieldErrors.name = nameError
    // The rotated copy can be bigger than the original, so the size is checked on the final file.
    const photoError = file ? validatePhoto(file) : 'errors.photoRequired'
    if (photoError) fieldErrors.photo = photoError
    if (Object.keys(fieldErrors).length > 0 || !file) return { ok: false, fieldErrors, values }

    try {
      await upload.mutateAsync({ image: file, wallName: name, uploadedBy: userId })
      onUploaded()
      return { ok: true, fieldErrors: {}, values }
    } catch (error) {
      return { ok: false, fieldErrors: {}, formError: uploadErrorKey(error), values }
    }
  }

  const [state, action, pending] = useActionState(submit, initialUploadState)

  return (
    <form action={action} noValidate className="grid gap-4 px-5 pt-4 pb-8">
      {state.formError ? (
        <p role="alert" className="border-2 border-error bg-surface p-3 font-semibold">
          {t(state.formError)}
        </p>
      ) : null}
      <PhotoPicker
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
        {t('upload.submit')}
      </Button>
    </form>
  )
}
