import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

// Torn-tape look from the mockups (hand-cut edge), used for grades and gym initials.
const TORN_EDGE =
  '[clip-path:polygon(0_8%,4%_0,9%_10%,15%_2%,100%_0,97%_30%,100%_62%,96%_100%,6%_94%,0_100%,3%_55%)]'

type TapeProps = {
  children: ReactNode
  className?: string
  // Hidden from screen readers when the text is only decoration (e.g. a gym initial).
  decorative?: boolean
}

export function Tape({ children, className, decorative = false }: TapeProps) {
  return (
    <span
      aria-hidden={decorative || undefined}
      className={cn(
        'inline-flex -rotate-2 items-center justify-center bg-tape font-display leading-none font-black text-on-tape',
        TORN_EDGE,
        className,
      )}
    >
      {children}
    </span>
  )
}
