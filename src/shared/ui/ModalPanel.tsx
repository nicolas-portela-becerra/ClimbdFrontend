import type { ReactNode } from 'react'
import { BackIcon, CloseIcon } from '@/shared/icons'
import { IconButton } from './IconButton'
import { Overlay } from './Overlay'

type ModalPanelProps = { open: boolean; label: string; children: ReactNode }

// Full-screen modal page that slides up from the bottom. Put the modal's state in a child component:
// the children only exist while the modal is open, so closing it discards that state.
export function ModalPanel({ open, label, children }: ModalPanelProps) {
  return (
    <Overlay open={open} label={label}>
      <div className="mx-auto flex h-full max-w-xl animate-panel-in flex-col overflow-hidden bg-ground group-data-[state=closed]/overlay:animate-panel-out motion-reduce:animate-none">
        {children}
      </div>
    </Overlay>
  )
}

type ModalHeaderProps = {
  title: string
  closeLabel: string
  onClose: () => void
  // Optional back arrow before the title (for multi-step modals).
  backLabel?: string
  onBack?: (() => void) | undefined
}

export function ModalHeader({ title, closeLabel, onClose, backLabel, onBack }: ModalHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-1 px-2 pt-5 pb-3 pl-5">
      {onBack ? (
        <IconButton label={backLabel ?? ''} onClick={onBack}>
          <BackIcon className="size-6" />
        </IconButton>
      ) : null}
      <h1 className="mr-auto min-w-0 font-display text-4xl leading-none font-extrabold uppercase">
        {title}
      </h1>
      <IconButton label={closeLabel} onClick={onClose} autoFocus>
        <CloseIcon className="size-6" />
      </IconButton>
    </header>
  )
}
