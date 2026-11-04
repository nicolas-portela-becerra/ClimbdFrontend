import { useQuery } from '@tanstack/react-query'
import { competitionsApi } from '@/api/client'
import { qk } from '@/api/keys'
import { apiErrorKind } from '@/shared/lib/apiError'

// The boulders of a competition. Before the start the server answers 403 to participants (organisers
// always get them), so that error is not retried.
export function useCompetitionBoulders(competitionId: number) {
  return useQuery({
    queryKey: qk.competitions.boulders(competitionId),
    queryFn: () => competitionsApi.listCompetitionBoulders({ competitionId }),
    retry: (count, error) => apiErrorKind(error) !== 'forbidden' && count < 2,
  })
}
