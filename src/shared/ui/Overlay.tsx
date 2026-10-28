import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion'
import { cn } from '@/shared/lib/cn'

// Must outlast the longest exit animation of the content.
const EXIT_MS = 300

type OverlayProps = {
  open: boolean
  label: string
  // Style the two phases with data-[state=closed]: on this element, or group-data-[state=closed]/overlay: on children.
  className?: string
  children: ReactNode
}

// Full-screen layer above the page (portal). The page behind becomes inert, and the layer stays
// mounted for EXIT_MS after `open` turns false so the content can animate out.
export function Overlay({ open, label, className, children }: OverlayProps) {
  const [mounted, setMounted] = useState(open)
  const reducedMotion = usePrefersReducedMotion()

  if (open && !mounted) setMounted(true)

  useEffect(() => {
    if (open || !mounted) return
    const id = setTimeout(() => setMounted(false), reducedMotion ? 0 : EXIT_MS)
    return () => clearTimeout(id)
  }, [open, mounted, reducedMotion])

  useEffect(() => {
    if (!mounted) return
    const root = document.getElementById('root')
    root?.setAttribute('inert', '')
    return () => root?.removeAttribute('inert')
  }, [mounted])

  if (!mounted) return null
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      data-state={open ? 'open' : 'closed'}
      className={cn(
        'group/overlay fixed inset-0 z-30 data-[state=closed]:pointer-events-none',
        className,
      )}
    >
      {children}
    </div>,
    document.body,
  )
}
