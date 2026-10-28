import { useEffect } from 'react'
import { cn } from '@/shared/lib/cn'
import { Button } from './Button'
import { Overlay } from './Overlay'

type ConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  cancelLabel: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
  // While the confirmed action runs: the confirm button spins and the dialog can't be dismissed.
  loading?: boolean
}

// Dialog centred on the screen over a dark backdrop. The confirm button is red (destructive actions).
export function ConfirmDialog({
  open,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open || loading) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, loading, onCancel])

  return (
    <Overlay
      open={open}
      label={title}
      className={cn(
        'grid place-items-center p-5',
        'data-[state=closed]:animate-stage-out motion-reduce:animate-none',
      )}
    >
      <div
        aria-hidden="true"
        onClick={loading ? undefined : onCancel}
        className="absolute inset-0 animate-stage-in bg-black/60 motion-reduce:animate-none"
      />
      <div className="relative w-full max-w-sm animate-stage-in border-2 border-ink bg-ground p-5 motion-reduce:animate-none">
        <h2 className="font-display text-3xl leading-none font-extrabold uppercase">{title}</h2>
        <p className="mt-3 text-muted">{message}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button onClick={onCancel} disabled={loading} autoFocus>
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            loading={loading}
            className="border-error bg-error text-ground"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Overlay>
  )
}
