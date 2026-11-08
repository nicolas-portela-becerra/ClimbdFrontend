import { useParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { CompetitionBoulderModal } from '@/features/boulder-editor/components/CompetitionBoulderModal'
import { CompetitionScreen } from '@/features/competitions/components/CompetitionScreen'

export default function Competition() {
  const { gymId, competitionId } = useParams()
  const { user } = useAuth()
  if (user?.id === undefined) return null

  return (
    <CompetitionScreen
      gymId={Number(gymId)}
      competitionId={Number(competitionId)}
      userId={user.id}
      renderBoulderEditor={(props) => <CompetitionBoulderModal {...props} />}
    />
  )
}
