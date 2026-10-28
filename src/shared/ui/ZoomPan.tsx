import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { MinusIcon, PlusIcon } from '@/shared/icons'
import { cn } from '@/shared/lib/cn'
import { MAX_SCALE, MIN_SCALE, panBy, zoomAt, type ZoomView } from '@/shared/lib/zoom'
import { IconButton } from './IconButton'

const BUTTON_STEP = 1.6
const WHEEL_SPEED = 0.0015
const DOUBLE_TAP_MS = 300
const DOUBLE_TAP_SCALE = 2.5
// Movement (px) from which a touch/click is a drag, not a tap.
const DRAG_THRESHOLD = 6
// Keeping a finger still this long (ms) starts the long-press gesture.
const LONG_PRESS_MS = 350

type Point = { x: number; y: number }

type LongPress = {
  // Called when a finger/mouse stays pressed (without moving) long enough; client coordinates.
  onStart: (point: Point) => void
  // Called as the pointer then moves; the photo is not panned while it is active.
  onMove: (point: Point) => void
  onEnd: () => void
}

type ZoomPanProps = {
  children: ReactNode
  className?: string
  longPress?: LongPress
  // Double tap (or double click) toggles the zoom. Off where quick repeated taps do something else.
  doubleTapZoom?: boolean
}

// Zoom and pan for whatever it wraps (the wall photo): pinch, drag, wheel / trackpad, double tap and
// +/- buttons. It uses one CSS transform, so zooming costs nothing extra. A drag never counts as a click
// on the children (so panning in the editor doesn't place holds).
export function ZoomPan({ children, className, longPress, doubleTapZoom = true }: ZoomPanProps) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<ZoomView>({ scale: 1, x: 0, y: 0 })
  const [gesturing, setGesturing] = useState(false)

  const pointers = useRef(new Map<number, Point>())
  // Where each pointer went down, to tell a tap from a drag.
  const downAt = useRef(new Map<number, Point>())
  const lastPinch = useRef<{ distance: number; center: Point } | null>(null)
  const dragged = useRef(false)
  const swallowClick = useRef(false)
  const lastTap = useRef<{ time: number; point: Point } | null>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressActive = useRef(false)
  // Always the latest callbacks, so the timer never calls stale ones.
  const longPressRef = useRef(longPress)
  useEffect(() => {
    longPressRef.current = longPress
  })

  const cancelLongPressTimer = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
    longPressTimer.current = null
  }
  const endLongPress = () => {
    cancelLongPressTimer()
    if (!longPressActive.current) return
    longPressActive.current = false
    longPressRef.current?.onEnd()
  }

  const size = () => {
    const rect = containerRef.current?.getBoundingClientRect()
    return {
      width: rect?.width ?? 0,
      height: rect?.height ?? 0,
      left: rect?.left ?? 0,
      top: rect?.top ?? 0,
    }
  }

  // Wheel / trackpad pinch (ctrl+wheel): needs a non-passive native listener to stop the page scrolling.
  useEffect(() => {
    const element = containerRef.current
    if (!element) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = element.getBoundingClientRect()
      const factor = Math.exp(-event.deltaY * WHEEL_SPEED)
      setView((current) =>
        zoomAt(
          current,
          current.scale * factor,
          event.clientX - rect.left,
          event.clientY - rect.top,
          rect.width,
          rect.height,
        ),
      )
    }
    element.addEventListener('wheel', onWheel, { passive: false })
    return () => element.removeEventListener('wheel', onWheel)
  }, [])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    downAt.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    setGesturing(true)
    if (pointers.current.size === 1) {
      dragged.current = false
      if (longPressRef.current) {
        const at = { x: event.clientX, y: event.clientY }
        longPressTimer.current = setTimeout(() => {
          longPressTimer.current = null
          if (pointers.current.size !== 1 || dragged.current) return
          longPressActive.current = true
          // Counts as a drag from now on, so the click at the end is swallowed.
          dragged.current = true
          longPressRef.current?.onStart(at)
        }, LONG_PRESS_MS)
      }
    }
    if (pointers.current.size === 2) {
      endLongPress()
      dragged.current = true
      lastPinch.current = pinchState(pointers.current)
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const previous = pointers.current.get(event.pointerId)
    if (!previous) return
    const next = { x: event.clientX, y: event.clientY }
    pointers.current.set(event.pointerId, next)
    const { width, height, left, top } = size()

    if (longPressActive.current) {
      longPressRef.current?.onMove(next)
      return
    }

    if (pointers.current.size >= 2) {
      const pinch = pinchState(pointers.current)
      const before = lastPinch.current
      lastPinch.current = pinch
      if (!before || before.distance === 0) return
      setView((current) => {
        const zoomed = zoomAt(
          current,
          current.scale * (pinch.distance / before.distance),
          before.center.x - left,
          before.center.y - top,
          width,
          height,
        )
        return panBy(
          zoomed,
          pinch.center.x - before.center.x,
          pinch.center.y - before.center.y,
          width,
          height,
        )
      })
      return
    }

    if (Math.hypot(next.x - previous.x, next.y - previous.y) === 0) return
    const start = downAt.current.get(event.pointerId) ?? previous
    if (Math.hypot(next.x - start.x, next.y - start.y) > DRAG_THRESHOLD) {
      dragged.current = true
      // Moved before the delay: it is a pan, not a long press.
      cancelLongPressTimer()
    }
    setView((current) => panBy(current, next.x - previous.x, next.y - previous.y, width, height))
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const down = pointers.current.get(event.pointerId)
    pointers.current.delete(event.pointerId)
    downAt.current.delete(event.pointerId)
    lastPinch.current = null
    if (pointers.current.size === 0) setGesturing(false)
    if (!down) return
    endLongPress()

    if (dragged.current) {
      // The click that follows a drag or pinch must not reach the children.
      swallowClick.current = true
      setTimeout(() => (swallowClick.current = false), 0)
      return
    }
    if (!doubleTapZoom) return
    const now = performance.now()
    const point = { x: event.clientX, y: event.clientY }
    const previousTap = lastTap.current
    if (
      previousTap &&
      now - previousTap.time < DOUBLE_TAP_MS &&
      Math.hypot(point.x - previousTap.point.x, point.y - previousTap.point.y) < 30
    ) {
      lastTap.current = null
      const { width, height, left, top } = size()
      setView((current) =>
        zoomAt(
          current,
          current.scale > MIN_SCALE ? MIN_SCALE : DOUBLE_TAP_SCALE,
          point.x - left,
          point.y - top,
          width,
          height,
        ),
      )
    } else {
      lastTap.current = { time: now, point }
    }
  }

  const onPointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    endLongPress()
    pointers.current.delete(event.pointerId)
    downAt.current.delete(event.pointerId)
    lastPinch.current = null
    if (pointers.current.size === 0) setGesturing(false)
  }

  // Buttons zoom around the centre of the container.
  const zoomBy = (factor: number) => {
    const { width, height } = size()
    setView((current) =>
      zoomAt(current, current.scale * factor, width / 2, height / 2, width, height),
    )
  }
  const reset = () => setView({ scale: 1, x: 0, y: 0 })

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      // A long press must not open the browser's context menu (e.g. "save image").
      onContextMenu={(event) => event.preventDefault()}
      onClickCapture={(event) => {
        if (swallowClick.current) {
          event.stopPropagation()
          event.preventDefault()
        }
      }}
      className={cn('relative size-full touch-none overflow-hidden select-none', className)}
    >
      <div
        className={cn(
          'size-full origin-top-left',
          !gesturing && 'transition-transform duration-150 ease-out motion-reduce:transition-none',
        )}
        style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
      >
        {children}
      </div>
      <div
        onPointerDown={(event) => event.stopPropagation()}
        className="absolute top-3.5 right-3.5 flex flex-col gap-1"
      >
        <IconButton
          label={t('zoom.in')}
          onClick={() => zoomBy(BUTTON_STEP)}
          disabled={view.scale >= MAX_SCALE}
          className="bg-ground disabled:opacity-50"
        >
          <PlusIcon className="size-6" />
        </IconButton>
        <IconButton
          label={t('zoom.out')}
          onClick={() => zoomBy(1 / BUTTON_STEP)}
          disabled={view.scale <= MIN_SCALE}
          className="bg-ground disabled:opacity-50"
        >
          <MinusIcon className="size-6" />
        </IconButton>
        {view.scale > MIN_SCALE ? (
          <IconButton
            label={t('zoom.reset')}
            onClick={reset}
            className="bg-ground font-cond text-sm font-bold"
          >
            1×
          </IconButton>
        ) : null}
      </div>
    </div>
  )
}

function pinchState(pointers: Map<number, Point>): { distance: number; center: Point } {
  const [a, b] = [...pointers.values()]
  if (!a || !b) return { distance: 0, center: { x: 0, y: 0 } }
  return {
    distance: Math.hypot(a.x - b.x, a.y - b.y),
    center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
  }
}
