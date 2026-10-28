import { useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { RotateIcon } from '@/shared/icons'
import { useFieldError } from '@/shared/hooks/useFieldError'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { ACCEPTED_IMAGE_TYPES } from '@/shared/lib/images'
import { rotatePhoto, validatePhoto } from '../photo'

type PhotoPickerProps = {
  // Called with the file to upload (rotation already applied), or null when there is none.
  onChange: (photo: File | null) => void
  error: string | undefined
  // The photo the wall has now (when editing): shown until another one is chosen.
  current?: Blob | undefined
}

// File picker with a preview and a rotate button. The rotation is always applied to the original
// file, so rotating several times never re-compresses an already re-compressed image.
export function PhotoPicker({ onChange, error: errorProp, current }: PhotoPickerProps) {
  const { t } = useTranslation('walls')
  const { error: fieldError, dismiss } = useFieldError(errorProp)
  const [original, setOriginal] = useState<File | null>(null)
  const [rotation, setRotation] = useState(0)
  const [shown, setShown] = useState<File | null>(null)
  const [pickError, setPickError] = useState<string | null>(null)
  const error = pickError ?? fieldError
  const preview = shown ?? current

  const show = (file: File | null) => {
    setShown(file)
    onChange(file)
  }

  const pick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    dismiss()
    const invalid = validatePhoto(file)
    if (invalid) {
      setPickError(t(invalid))
      return
    }
    setPickError(null)
    setOriginal(file)
    setRotation(0)
    show(file)
  }

  const rotate = async () => {
    if (!original) return
    const next = (rotation + 90) % 360
    setRotation(next)
    try {
      show(next === 0 ? original : await rotatePhoto(original, next))
    } catch {
      setPickError(t('errors.unknown'))
    }
  }

  return (
    <div className="grid gap-2">
      <span className="font-cond text-sm font-semibold tracking-wide uppercase">
        {t('upload.photo')}
      </span>
      <div className="grid min-h-56 place-items-center bg-neutral-800">
        {preview ? (
          <img
            alt={t('upload.previewLabel')}
            className="max-h-72 w-full object-contain"
            // The ref owns the object URL: created when the element shows this file, revoked after.
            ref={(img) => {
              if (!img) return
              const url = URL.createObjectURL(preview)
              img.src = url
              return () => URL.revokeObjectURL(url)
            }}
          />
        ) : null}
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <label
          className={cn(
            'flex min-h-12 cursor-pointer items-center justify-center border-2 border-ink bg-surface px-4 font-cond text-lg font-bold tracking-wide uppercase',
            'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink',
          )}
        >
          <input
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            onChange={pick}
            className="sr-only"
          />
          {preview ? t('upload.change') : t('upload.choose')}
        </label>
        <Button
          type="button"
          disabled={!shown}
          onClick={() => void rotate()}
          aria-label={t('upload.rotate')}
          className="min-h-12 w-12 px-0"
        >
          <RotateIcon className="size-6" />
        </Button>
      </div>
      {error ? <p className="text-sm font-semibold text-error">{error}</p> : null}
    </div>
  )
}
