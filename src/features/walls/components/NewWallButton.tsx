import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlusIcon } from '@/shared/icons'
import { Button } from '@/shared/ui/Button'
import { UploadWallModal } from './UploadWallModal'

type NewWallButtonProps = { gymId: number; userId: number }

export function NewWallButton(props: NewWallButtonProps) {
  const { t } = useTranslation('walls')
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="primary"
        aria-label={t('upload.open')}
        onClick={() => setOpen(true)}
        className="size-11 min-h-11 w-11 px-0"
      >
        <PlusIcon className="size-6" />
      </Button>
      <UploadWallModal open={open} onClose={() => setOpen(false)} {...props} />
    </>
  )
}
