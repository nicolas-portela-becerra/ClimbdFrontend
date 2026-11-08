import { useQuery } from '@tanstack/react-query'
import { competitionsApi } from '@/api/client'
import { qk } from '@/api/keys'
import { apiErrorKind } from '@/shared/lib/apiError'

// The competition's ranking. The server gives an empty list until dateTo plus the grace period have
// passed, and 403 to anyone who is not an admin or the gym's owner (not retried).
export function useCompetitionRanking(competitionId: number) {
  return useQuery({
    queryKey: qk.competitions.ranking(competitionId),
    queryFn: () => competitionsApi.getCompetitionRanking({ competitionId }),
    staleTime: 30_000,
    retry: (count, error) => apiErrorKind(error) !== 'forbidden' && count < 2,
  })
}
