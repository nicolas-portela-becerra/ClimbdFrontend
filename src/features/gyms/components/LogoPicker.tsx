import { useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { ACCEPTED_IMAGE_TYPES, blobToBase64, isAcceptedImage } from '@/shared/lib/images'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'

type LogoPickerProps = {
  // Called with the chosen file as base64, exactly as picked (the backend processes it), or null.
  onChange: (base64: string | null) => void
}

export function LogoPicker({ onChange }: LogoPickerProps) {
  const { t } = useTranslation('gyms')
  const [preview, setPreview] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const pick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!isAcceptedImage(file)) {
      setError(t('form.errors.wrongType'))
      return
    }
    try {
      const base64 = await blobToBase64(file)
      setError(null)
      setPreview(file)
      onChange(base64)
    } catch {
      setError(t('form.errors.logoFailed'))
    }
  }

  const remove = () => {
    setPreview(null)
    setError(null)
    onChange(null)
  }

  return (
    <div className="grid gap-2">
      <span className="font-cond text-sm font-semibold tracking-wide uppercase">
        {t('form.logo')}
      </span>
      <div className="grid grid-cols-[6rem_1fr] items-center gap-3">
        <div className="grid size-24 place-items-center bg-neutral-800">
          {preview ? (
            <img
              alt={t('form.logoPreview')}
              className="size-full object-cover"
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
        <div className="grid gap-2">
          <label
            className={cn(
              'flex min-h-12 cursor-pointer items-center justify-center border-2 border-ink bg-surface px-4 font-cond text-lg font-bold tracking-wide uppercase',
              'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink',
            )}
          >
            <input
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              onChange={(event) => void pick(event)}
              className="sr-only"
            />
            {preview ? t('form.changeLogo') : t('form.chooseLogo')}
          </label>
          {preview ? (
            <Button type="button" onClick={remove} className="min-h-12 text-base">
              {t('form.removeLogo')}
            </Button>
          ) : null}
        </div>
      </div>
      {error ? <p className="text-sm font-semibold text-error">{error}</p> : null}
    </div>
  )
}
