import { useRef, useState, type MouseEvent } from 'react'
import { useWallImageData } from '@/api/queries/useWallImageBlob'
import { BlobImage } from '@/shared/ui/BlobImage'
import { HoldRing } from '@/shared/ui/HoldRing'
import { Spinner } from '@/shared/ui/Spinner'
import { ZoomPan } from '@/shared/ui/ZoomPan'
import { radiusAfterDrag, type EditorHold } from '../useHoldEditor'

type Point = { x: number; y: number }
type PhotoSize = { width: number; height: number }

// The hold a long press acts on: its id, centre (ratios of the photo) and current radius.
export type ResizeTarget = { id: number; x: number; y: number; r: number }

type EditorCanvasProps = {
  wallImageId: number
  holds: EditorHold[]
  label: string
  onTap: (point: Point, size: PhotoSize) => void
  // Press and hold: places a new hold there, or picks the existing hold under the finger, and returns it.
  onLongPress: (point: Point, size: PhotoSize) => ResizeTarget | undefined
  onResize: (id: number, radius: number) => void
}

type Resize = { id: number; centre: Point; startRadius: number; startDistance: number }

// The wall photo with zoom/pan. A tap marks a hold; pressing and holding then dragging resizes one.
// All positions are reported as ratios of the photo.
export function EditorCanvas({
  wallImageId,
  holds,
  label,
  onTap,
  onLongPress,
  onResize,
}: EditorCanvasProps) {
  const wall = useWallImageData(wallImageId)
  const svgRef = useRef<SVGSVGElement>(null)
  const resize = useRef<Resize | null>(null)
  const [glowing, setGlowing] = useState<number | null>(null)

  if (!wall.data) {
    return (
      <div className="grid size-full place-items-center text-white">
        <Spinner />
      </div>
    )
  }
  const { blob, width, height } = wall.data
  const size = { width, height }

  // Screen position → position on the photo (ratios), or null when it is outside the photo.
  const toPhoto = (clientX: number, clientY: number): Point | null => {
    const matrix = svgRef.current?.getScreenCTM()
    if (!matrix) return null
    const point = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse())
    const x = point.x / width
    const y = point.y / height
    return x < 0 || x > 1 || y < 0 || y > 1 ? null : { x, y }
  }

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    const point = toPhoto(event.clientX, event.clientY)
    if (point) onTap(point, size)
  }

  const startResize = ({ x, y }: Point) => {
    const point = toPhoto(x, y)
    if (!point) return
    const target = onLongPress(point, size)
    if (!target) return
    const centre = { x: target.x, y: target.y }
    resize.current = {
      id: target.id,
      centre,
      startRadius: target.r,
      startDistance: Math.hypot((point.x - centre.x) * width, (point.y - centre.y) * height),
    }
    setGlowing(target.id)
  }

  const moveResize = ({ x, y }: Point) => {
    const current = resize.current
    const point = toPhoto(x, y)
    if (!current || !point) return
    const distance = Math.hypot(
      (point.x - current.centre.x) * width,
      (point.y - current.centre.y) * height,
    )
    onResize(
      current.id,
      radiusAfterDrag(current.startRadius, current.startDistance, distance, width),
    )
  }

  const endResize = () => {
    resize.current = null
    setGlowing(null)
  }

  return (
    <ZoomPan
      doubleTapZoom={false}
      longPress={{ onStart: startResize, onMove: moveResize, onEnd: endResize }}
    >
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
            glow={hold.id === glowing}
          />
        ))}
      </svg>
    </ZoomPan>
  )
}
