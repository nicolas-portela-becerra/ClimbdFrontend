import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'
import { Spinner } from './Spinner'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
  loading?: boolean
}

export function Button({
  variant = 'secondary',
  loading = false,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'flex min-h-14 w-full items-center justify-center gap-2.5 border-2 px-4 font-cond text-lg font-bold tracking-wide uppercase',
        'transition-[transform,background-color,color] duration-150 ease-out active:scale-95 motion-reduce:active:scale-100',
        'disabled:opacity-50',
        variant === 'primary'
          ? 'border-accent bg-accent text-on-accent'
          : 'border-ink bg-surface text-ink',
        className,
      )}
      {...props}
    >
      {loading ? <Spinner className="size-5" /> : null}
      {children}
    </button>
  )
}
