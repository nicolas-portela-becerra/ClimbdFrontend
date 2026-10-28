import { cn } from '@/shared/lib/cn'
import { FOOT_ROLE, ROLE_COLOR_VAR, ROLE_STROKE } from '@/shared/lib/holds'

type HoldRingProps = {
  cx: number
  cy: number
  r: number
  role: number
  // Delay before the ring pops in, to stagger several rings.
  delayMs?: number
  // Soft glow in the hold's colour (e.g. while it is being resized).
  glow?: boolean
}

// A ring around a hold, drawn inside an <svg> that is scaled to the photo. Strokes keep their pixel
// width whatever the scale; foot holds are dashed so the role is not only a colour.
export function HoldRing({ cx, cy, r, role, delayMs = 0, glow = false }: HoldRingProps) {
  const color = ROLE_COLOR_VAR[role]
  return (
    <g
      className="origin-center animate-ring-in [transform-box:fill-box] motion-reduce:animate-none"
      style={{
        animationDelay: `${delayMs}ms`,
        ...(glow
          ? { filter: `drop-shadow(0 0 6px var(${color})) drop-shadow(0 0 14px var(${color}))` }
          : {}),
      }}
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        strokeWidth={5}
        vectorEffect="non-scaling-stroke"
        className="stroke-black/70"
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        strokeWidth={3}
        vectorEffect="non-scaling-stroke"
        className={cn(ROLE_STROKE[role], role === FOOT_ROLE && '[stroke-dasharray:6_4]')}
      />
    </g>
  )
}
