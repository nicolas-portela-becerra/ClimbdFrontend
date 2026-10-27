import { useRef, type MouseEvent } from 'react'
import { useWallImageData } from '@/api/queries/useWallImageBlob'
import { BlobImage } from '@/shared/ui/BlobImage'
import { HoldRing } from '@/shared/ui/HoldRing'
import { Spinner } from '@/shared/ui/Spinner'
import type { EditorHold } from '../useHoldEditor'

type EditorCanvasProps = {
  wallImageId: number
  holds: EditorHold[]
  label: string
  onTap: (point: { x: number; y: number }, size: { width: number; height: number }) => void
}

// The whole wall photo; tapping it reports the tap as ratios of the photo.
export function EditorCanvas({ wallImageId, holds, label, onTap }: EditorCanvasProps) {
  const wall = useWallImageData(wallImageId)
  const svgRef = useRef<SVGSVGElement>(null)

  if (!wall.data) {
    return (
      <div className="grid size-full place-items-center text-white">
        <Spinner />
      </div>
    )
  }
  const { blob, width, height } = wall.data

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    const matrix = svg?.getScreenCTM()
    if (!svg || !matrix) return
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse())
    const x = point.x / width
    const y = point.y / height
    // Taps on the bars around the photo (outside it) are ignored.
    if (x < 0 || x > 1 || y < 0 || y > 1) return
    onTap({ x, y }, { width, height })
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={label}
      onClick={handleClick}
      className="size-full cursor-crosshair touch-manipulation"
    >
      <BlobImage blob={blob} width={width} height={height} />
      {holds.map((hold) => (
        <HoldRing
          key={hold.id}
          cx={hold.x * width}
          cy={hold.y * height}
          r={hold.r * width}
          role={hold.role}
        />
      ))}
    </svg>
  )
}
