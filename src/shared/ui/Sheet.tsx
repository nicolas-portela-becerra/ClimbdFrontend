import { useRef, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type SheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  // Accessible name of the handle button.
  label: string
  className?: string
  children: ReactNode
}

type Drag = {
  startY: number
  startTime: number
  base: number
  max: number
  y: number
  moved: boolean
}

// Bottom sheet that rests at the bottom with only its handle showing (closed) or fully raised (open).
// Tap or drag the handle; a drag snaps by release speed, otherwise by which half it ended in.
export function Sheet({ open, onOpenChange, label, className, children }: SheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLButtonElement>(null)
  const safeAreaRef = useRef<HTMLDivElement>(null)
  const drag = useRef<Drag | null>(null)
  const swallowClick = useRef(false)

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    const sheet = sheetRef.current
    const handle = handleRef.current
    const safeArea = safeAreaRef.current
    if (!sheet || !handle || !safeArea) return
    const max = sheet.offsetHeight - handle.offsetHeight - safeArea.offsetHeight
    const base = open ? 0 : max
    drag.current = {
      startY: event.clientY,
      startTime: performance.now(),
      base,
      max,
      y: base,
      moved: false,
    }
    handle.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const current = drag.current
    const sheet = sheetRef.current
    if (!current || !sheet) return
    const delta = event.clientY - current.startY
    if (!current.moved && Math.abs(delta) < 4) return
    current.moved = true
    current.y = Math.min(current.max, Math.max(0, current.base + delta))
    sheet.style.transition = 'none'
    sheet.style.translate = `0 ${current.y}px`
  }

  const release = (event: PointerEvent<HTMLButtonElement>, cancelled: boolean) => {
    const current = drag.current
    const sheet = sheetRef.current
    drag.current = null
    if (!current?.moved || !sheet) return
    // The click that follows a drag must not toggle the sheet again.
    swallowClick.current = true
    setTimeout(() => (swallowClick.current = false), 0)
    sheet.style.transition = ''
    sheet.style.translate = ''
    if (cancelled) return
    const velocity =
      (event.clientY - current.startY) / Math.max(1, performance.now() - current.startTime)
    onOpenChange(Math.abs(velocity) > 0.11 ? velocity < 0 : current.y < current.max / 2)
  }

  return (
    <div
      ref={sheetRef}
      className={cn(
        'absolute inset-x-0 bottom-0 flex flex-col border-t-2 border-ink bg-ground',
        'transition-[translate] duration-400 ease-drawer motion-reduce:duration-0',
        open ? 'translate-y-0' : 'translate-y-[calc(100%-2.75rem-env(safe-area-inset-bottom))]',
        className,
      )}
    >
      {/* Measures the bottom safe area (home indicator) so the closed sheet keeps its handle above it. */}
      <div
        ref={safeAreaRef}
        aria-hidden="true"
        className="pointer-events-none absolute h-[env(safe-area-inset-bottom)] w-0"
      />
      <button
        ref={handleRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => {
          if (swallowClick.current) return
          onOpenChange(!open)
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => release(event, false)}
        onPointerCancel={(event) => release(event, true)}
        className="grid h-11 w-full shrink-0 touch-none place-items-center"
      >
        <span aria-hidden="true" className="h-1.5 w-10 bg-muted" />
      </button>
      <div inert={!open} className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain">
        {children}
      </div>
    </div>
  )
}
