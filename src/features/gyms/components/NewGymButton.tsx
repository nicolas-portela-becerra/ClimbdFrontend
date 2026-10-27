import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlusIcon } from '@/shared/icons'
import { Button } from '@/shared/ui/Button'
import { CreateGymModal } from './CreateGymModal'

export function NewGymButton({ userId }: { userId: number }) {
  const { t } = useTranslation('gyms')
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="primary"
        aria-label={t('create')}
        onClick={() => setOpen(true)}
        className="size-11 min-h-11 w-11 px-0"
      >
        <PlusIcon className="size-6" />
      </Button>
      <CreateGymModal open={open} onClose={() => setOpen(false)} userId={userId} />
    </>
  )
}
