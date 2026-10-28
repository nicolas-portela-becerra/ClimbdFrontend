import type { HoldDto } from '@api'
import { normalizeRole } from '@/shared/lib/holds'
import { BlobImage } from '@/shared/ui/BlobImage'
import { HoldRing } from '@/shared/ui/HoldRing'

type BoulderHoldsProps = {
  blob: Blob
  // Pixel size of the photo: holds are ratios of it, and the SVG keeps the whole photo visible.
  width: number
  height: number
  holds: HoldDto[]
  label: string
}

const STAGGER_MS = 45
const HOLE_FACTOR = 1.15

export function BoulderHolds({ blob, width, height, holds, label }: BoulderHoldsProps) {
  const placed = holds.filter(
    (hold) =>
      hold.coordX !== undefined && hold.coordY !== undefined && hold.radiusRatio !== undefined,
  )

  // One path: the whole photo with a hole cut around each hold, so everything else is dimmed.
  const dimming =
    `M0 0H${width}V${height}H0Z` +
    placed
      .map((hold) => {
        const cx = (hold.coordX ?? 0) * width
        const cy = (hold.coordY ?? 0) * height
        const r = (hold.radiusRatio ?? 0) * width * HOLE_FACTOR
        return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`
      })
      .join('')

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={label}
      className="size-full"
    >
      <BlobImage blob={blob} width={width} height={height} />
      {placed.length > 0 ? (
        <path
          d={dimming}
          fillRule="evenodd"
          className="animate-stage-in fill-black/60 motion-reduce:animate-none"
        />
      ) : null}
      {placed.map((hold, index) => (
        <HoldRing
          key={hold.id ?? index}
          cx={(hold.coordX ?? 0) * width}
          cy={(hold.coordY ?? 0) * height}
          r={(hold.radiusRatio ?? 0) * width}
          role={normalizeRole(hold.color)}
          delayMs={index * STAGGER_MS}
        />
      ))}
    </svg>
  )
}
