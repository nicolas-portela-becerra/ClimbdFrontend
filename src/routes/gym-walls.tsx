import { useLocation, useParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { GymWallsHeader } from '@/features/gyms/components/GymWallsHeader'
import { NewWallButton } from '@/features/walls/components/NewWallButton'
import { WallList } from '@/features/walls/components/WallList'

export default function GymWalls() {
  const { gymId } = useParams()
  const location = useLocation()
  const { user } = useAuth()
  const name = (location.state as { gymName?: string } | null)?.gymName

  return (
    <GymWallsHeader
      gymId={Number(gymId)}
      name={name}
      action={
        user?.id !== undefined ? <NewWallButton gymId={Number(gymId)} userId={user.id} /> : null
      }
    >
      <WallList gymId={Number(gymId)} />
    </GymWallsHeader>
  )
}
