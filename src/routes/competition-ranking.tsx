import { useParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { RankingScreen } from '@/features/competitions/components/RankingScreen'

export default function CompetitionRanking() {
  const { gymId, competitionId } = useParams()
  const { user } = useAuth()
  if (user?.id === undefined) return null

  return <RankingScreen gymId={Number(gymId)} competitionId={Number(competitionId)} />
}
