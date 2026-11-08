import { useQuery } from '@tanstack/react-query'
import { competitionsApi } from '@/api/client'
import { qk } from '@/api/keys'

// Upcoming and running competitions of a gym. Rarely changes: kept fresh for a minute.
export function useActiveCompetitions(gymId: number) {
  return useQuery({
    queryKey: qk.competitions.active(gymId),
    queryFn: () => competitionsApi.listActiveCompetitions({ gymId }),
    staleTime: 60_000,
  })
}
