import { useRef, useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useWallImageData } from '@/api/queries/useWallImageBlob'
import { MinusIcon, PlusIcon, TrashIcon } from '@/shared/icons'
import { BlobImage } from '@/shared/ui/BlobImage'
import { HoldRing } from '@/shared/ui/HoldRing'
import { IconButton } from '@/shared/ui/IconButton'
import { Spinner } from '@/shared/ui/Spinner'
import { ZoomPan } from '@/shared/ui/ZoomPan'
import {
  clampRadius,
  findHold,
  MAX_RADIUS,
  MIN_RADIUS,
  RADIUS_STEP,
  type EditorHold,
} from '../useHoldEditor'

type Point = { x: number; y: number }

type EditorCanvasProps = {
  wallImageId: number
  holds: EditorHold[]
  label: string
  // Role picked for new holds; choosing another one deselects the hold, so the next tap places a new one.
  role: number
  // A tap on empty photo (ratios of the photo).
  onTap: (point: Point) => void
  // Called once before a hold is moved, resized or deleted.
  onEditStart: () => void
  onChange: (id: number, patch: Partial<Pick<EditorHold, 'x' | 'y' | 'r'>>) => void
  onRemove: (id: number) => void
}

type Drag = { id: number; offset: Point; started: boolean }

// The wall photo with zoom/pan. Tapping a hold selects it (it glows): drag it to move it, use + and -
// to resize it, or delete it. Tapping empty photo deselects, or marks a new hold when none is selected.
export function EditorCanvas({
  wallImageId,
  holds,
  label,
  role,
  onTap,
  onEditStart,
  onChange,
  onRemove,
}: EditorCanvasProps) {
  const { t } = useTranslation('editor')
  const wall = useWallImageData(wallImageId)
  const svgRef = useRef<SVGSVGElement>(null)
  const drag = useRef<Drag | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [seenRole, setSeenRole] = useState(role)
  if (role !== seenRole) {
    setSeenRole(role)
    setSelectedId(null)
  }

  if (!wall.data) {
    return (
      <div className="grid size-full place-items-center text-white">
        <Spinner />
      </div>
    )
  }
  const { blob, width, height } = wall.data
  const size = { width, height }
  const selected = holds.find((hold) => hold.id === selectedId)

  // Screen position → position on the photo (ratios); may fall outside 0..1.
  const toPhotoRaw = (clientX: number, clientY: number): Point | null => {
    const matrix = svgRef.current?.getScreenCTM()
    if (!matrix) return null
    const point = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse())
    return { x: point.x / width, y: point.y / height }
  }
  const inside = (p: Point) => p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    const point = toPhotoRaw(event.clientX, event.clientY)
    if (!point || !inside(point)) return
    const hit = holds[findHold(holds, point, size)]
    if (hit) setSelectedId(hit.id)
    else if (selected) setSelectedId(null)
    else onTap(point)
  }

  const grab = ({ x, y }: Point) => {
    const point = toPhotoRaw(x, y)
    const hit = point && holds[findHold(holds, point, size)]
    if (!point || !hit) return false
    setSelectedId(hit.id)
    drag.current = {
      id: hit.id,
      offset: { x: hit.x - point.x, y: hit.y - point.y },
      started: false,
    }
    return true
  }

  const moveGrabbed = ({ x, y }: Point) => {
    const current = drag.current
    const point = toPhotoRaw(x, y)
    if (!current || !point) return
    if (!current.started) {
      current.started = true
      onEditStart()
    }
    onChange(current.id, {
      x: Math.min(1, Math.max(0, point.x + current.offset.x)),
      y: Math.min(1, Math.max(0, point.y + current.offset.y)),
    })
  }

  const resizeSelected = (delta: number) => {
    if (!selected) return
    onEditStart()
    onChange(selected.id, { r: clampRadius(selected.r + delta) })
  }

  const controls = selected ? (
    <>
      <IconButton
        label={t('hold.bigger')}
        onClick={() => resizeSelected(RADIUS_STEP)}
        disabled={selected.r >= MAX_RADIUS}
        className="bg-ground disabled:opacity-50"
      >
        <PlusIcon className="size-6" />
      </IconButton>
      <IconButton
        label={t('hold.smaller')}
        onClick={() => resizeSelected(-RADIUS_STEP)}
        disabled={selected.r <= MIN_RADIUS}
        className="bg-ground disabled:opacity-50"
      >
        <MinusIcon className="size-6" />
      </IconButton>
      <IconButton
        label={t('hold.delete')}
        onClick={() => {
          onRemove(selected.id)
          setSelectedId(null)
        }}
        className="bg-ground"
      >
        <TrashIcon className="size-6" />
      </IconButton>
    </>
  ) : null

  return (
    <ZoomPan
      doubleTapZoom={false}
      zoomButtons={false}
      controls={controls}
      grab={{ onGrab: grab, onMove: moveGrabbed, onEnd: () => (drag.current = null) }}
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
            glow={hold.id === selected?.id}
          />
        ))}
      </svg>
    </ZoomPan>
  )
}
