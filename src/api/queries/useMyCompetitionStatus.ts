import { useQuery } from '@tanstack/react-query'
import { competitionsApi } from '@/api/client'
import { qk } from '@/api/keys'
import { apiErrorKind } from '@/shared/lib/apiError'

// What the server has stored for the current user (404 when not registered: not retried).
export function useMyCompetitionStatus(competitionId: number, enabled = true) {
  return useQuery({
    queryKey: qk.competitions.me(competitionId),
    queryFn: () => competitionsApi.getMyCompetitionStatus({ competitionId }),
    retry: (count, error) => apiErrorKind(error) !== 'notFound' && count < 2,
    enabled,
  })
}
