import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { CloseIcon } from '@/shared/icons'
import { ToastContext } from '@/shared/hooks/useToast'
import { cn } from '@/shared/lib/cn'
import { IconButton } from './IconButton'

const TOAST_MS = 5000

type Toast = { message: string; error: boolean }

export function ToastProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  // A new object per call, so showing the same message again restarts the timer.
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), TOAST_MS)
    return () => clearTimeout(id)
  }, [toast])

  return (
    <ToastContext
      value={{
        showError: (message) => setToast({ message, error: true }),
        showSuccess: (message) => setToast({ message, error: false }),
      }}
    >
      {children}
      {/* In a portal, outside #root, so it stays usable above the modal layers that make #root inert. */}
      {toast
        ? createPortal(
            <div
              role={toast.error ? 'alert' : 'status'}
              className={cn(
                'fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex max-w-xs animate-stage-in items-center gap-1 border-2 bg-ground py-1 pr-1 pl-3 motion-reduce:animate-none',
                toast.error ? 'border-error' : 'border-ink',
              )}
            >
              <p className="font-semibold">{toast.message}</p>
              <IconButton
                label={t('toast.close')}
                onClick={() => setToast(null)}
                className="shrink-0"
              >
                <CloseIcon className="size-5" />
              </IconButton>
            </div>,
            document.body,
          )
        : null}
    </ToastContext>
  )
}
