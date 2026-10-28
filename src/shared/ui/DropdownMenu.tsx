import { useEffect, useRef, useState } from 'react'
import { MoreIcon } from '@/shared/icons'
import { cn } from '@/shared/lib/cn'
import { IconButton } from './IconButton'

export type MenuItem = { label: string; onSelect: () => void; destructive?: boolean }

type DropdownMenuProps = {
  // Accessible name of the three-dots button.
  label: string
  items: MenuItem[]
  className?: string
}

// Three-dots button that opens a small list of actions. Closes on a click outside, on Escape, or after
// choosing an item.
export function DropdownMenu({ label, items, className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <IconButton
        label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <MoreIcon className="size-6" />
      </IconButton>
      {open ? (
        <div
          role="menu"
          className="absolute top-full right-0 z-20 min-w-40 animate-stage-in border-2 border-ink bg-ground motion-reduce:animate-none"
        >
          {items.map((item, index) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              autoFocus={index === 0}
              onClick={() => {
                setOpen(false)
                item.onSelect()
              }}
              className={cn(
                'flex min-h-11 w-full items-center px-4 text-left font-cond text-lg font-bold tracking-wide uppercase active:bg-surface',
                item.destructive && 'text-error',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
