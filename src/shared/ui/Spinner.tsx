import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'

export function Spinner({ className }: { className?: string }) {
  const { t } = useTranslation()
  return (
    <svg
      role="status"
      aria-label={t('loading')}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('size-8 animate-spin motion-reduce:animate-none', className)}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-20" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
