import { Link } from 'react-router-dom'
import type { WallImageSummary } from '@api'
import { useWallImageThumbnail } from '@/api/queries/useWallImageBlob'
import { AuthImage } from '@/shared/ui/AuthImage'
import { WallMenu } from './WallMenu'

export function WallRow({ wall, gymId }: { wall: WallImageSummary; gymId: number }) {
  const name = wall.wallName ?? ''
  const thumbnail = useWallImageThumbnail(wall.id ?? 0)

  return (
    <li className="relative">
      <Link
        to={`/gyms/${gymId}/walls/${wall.id}`}
        state={{ wallName: name }}
        className="relative block h-52 overflow-hidden bg-neutral-800 active:opacity-90"
      >
        <AuthImage blob={thumbnail.data} alt="" />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/70 to-transparent"
        />
        <span className="absolute right-4 bottom-3 left-4 font-display text-4xl leading-none font-extrabold text-white uppercase [text-shadow:0_2px_0_rgb(0_0_0/0.5)]">
          {name}
        </span>
      </Link>
      <WallMenu wall={wall} gymId={gymId} className="absolute top-2 right-2" />
    </li>
  )
}
