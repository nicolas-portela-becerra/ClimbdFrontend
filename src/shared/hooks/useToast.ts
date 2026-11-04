import { createContext, useContext } from 'react'

export type ToastContextValue = {
  // Shows an error pop-up at the bottom-right. Showing another one replaces it and restarts the timer.
  showError: (message: string) => void
  // Same pop-up for a confirmation (neutral border, read politely by screen readers).
  showSuccess: (message: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext)
  if (!value) throw new Error('useToast must be used inside <ToastProvider>')
  return value
}
