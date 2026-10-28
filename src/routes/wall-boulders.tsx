import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { BoulderResponseDto } from '@api'
import { useAuth } from '@/features/auth/useAuth'
import { BoulderList } from '@/features/boulders/components/BoulderList'
import { BoulderMenu } from '@/features/boulder-editor/components/BoulderMenu'
import { NewBoulderButton } from '@/features/boulder-editor/components/NewBoulderButton'
import { BoulderViewer } from '@/features/boulders/components/BoulderViewer'
import { WallHeader } from '@/features/walls/components/WallHeader'

// The selected boulder lives in the URL (?boulder=ID) so back, refresh and shared links work.
const getHref = (boulder: BoulderResponseDto) => `?boulder=${boulder.id}`

export default function WallBoulders() {
  const { gymId, wallId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { user } = useAuth()
  const name = (location.state as { wallName?: string } | null)?.wallName

  const requested = Number(params.get('boulder'))
  const boulderId = Number.isInteger(requested) && requested > 0 ? requested : undefined

  // Opening a boulder pushed a history entry: go back to it. A direct link has none: replace the URL.
  const closeBoulder = () => {
    if (location.key !== 'default') void navigate(-1)
    else void navigate(`/gyms/${gymId}/walls/${wallId}`, { replace: true })
  }

  return (
    <WallHeader
      gymId={Number(gymId)}
      wallId={Number(wallId)}
      name={name}
      action={
        user?.id !== undefined ? (
          <NewBoulderButton gymId={Number(gymId)} wallImageId={Number(wallId)} userId={user.id} />
        ) : null
      }
    >
      <BoulderList
        wallImageId={Number(wallId)}
        getHref={getHref}
        linkState={location.state}
        renderActions={(boulder) =>
          user?.id !== undefined ? (
            <BoulderMenu
              boulder={boulder}
              gymId={Number(gymId)}
              wallImageId={Number(wallId)}
              userId={user.id}
            />
          ) : null
        }
        className="border-t-2 border-ink"
      />
      <BoulderViewer
        wallImageId={Number(wallId)}
        boulderId={boulderId}
        onClose={closeBoulder}
        getHref={getHref}
        linkState={location.state}
      />
    </WallHeader>
  )
}
