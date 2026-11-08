import { useParams } from 'react-router-dom'
import { canSet } from '@/features/auth/gymRoles'
import { useAuth } from '@/features/auth/useAuth'
import { CompetitionBoulderModal } from '@/features/boulder-editor/components/CompetitionBoulderModal'
import { CompetitionScreen } from '@/features/competitions/components/CompetitionScreen'

export default function Competition() {
  const { gymId, competitionId } = useParams()
  const { user, gymRoles } = useAuth()
  if (user?.id === undefined) return null

  return (
    <CompetitionScreen
      gymId={Number(gymId)}
      competitionId={Number(competitionId)}
      userId={user.id}
      canManage={canSet(user, gymRoles, Number(gymId))}
      renderBoulderEditor={(props) => <CompetitionBoulderModal {...props} />}
    />
  )
}
