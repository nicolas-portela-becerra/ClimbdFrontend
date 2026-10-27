import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { label: string }

export function IconButton({
  label,
  className,
  children,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        'grid size-11 place-items-center text-ink transition-transform duration-150 ease-out active:scale-95 motion-reduce:active:scale-100',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
