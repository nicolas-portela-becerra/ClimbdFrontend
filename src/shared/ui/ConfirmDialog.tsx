import { useEffect } from 'react'
import { cn } from '@/shared/lib/cn'
import { Button } from './Button'
import { Overlay } from './Overlay'

type ConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  // Omit for a single-button dialog (only the confirm action).
  cancelLabel?: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
  // While the confirmed action runs: the confirm button spins and the dialog can't be dismissed.
  loading?: boolean
  // Red confirm button for actions that destroy something (the default).
  destructive?: boolean
}

// Dialog centred on the screen over a dark backdrop. The confirm button is red for destructive actions.
export function ConfirmDialog({
  open,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  loading = false,
  destructive = true,
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
        <div className={cn('mt-5 grid gap-3', cancelLabel ? 'grid-cols-2' : 'grid-cols-1')}>
          {cancelLabel ? (
            <Button onClick={onCancel} disabled={loading} autoFocus>
              {cancelLabel}
            </Button>
          ) : null}
          <Button
            onClick={onConfirm}
            loading={loading}
            {...(cancelLabel ? {} : { autoFocus: true })}
            {...(destructive
              ? { className: 'border-error bg-error text-ground' }
              : { variant: 'primary' as const })}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Overlay>
  )
}
