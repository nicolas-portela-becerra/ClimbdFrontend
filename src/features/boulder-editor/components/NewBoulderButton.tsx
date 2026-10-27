import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlusIcon } from '@/shared/icons'
import { IconButton } from '@/shared/ui/IconButton'
import { CreateBoulderModal } from './CreateBoulderModal'

type NewBoulderButtonProps = { gymId: number; wallImageId: number; userId: number }

export function NewBoulderButton(props: NewBoulderButtonProps) {
  const { t } = useTranslation('editor')
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton label={t('open')} onClick={() => setOpen(true)} className="bg-ground">
        <PlusIcon className="size-6" />
      </IconButton>
      <CreateBoulderModal open={open} onClose={() => setOpen(false)} {...props} />
    </>
  )
}
