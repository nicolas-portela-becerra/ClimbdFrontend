import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CompetitionRequest } from '@api'
import { competitionsApi } from '@/api/client'
import { qk } from '@/api/keys'

export function useCreateCompetition(gymId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (competitionRequest: CompetitionRequest) =>
      competitionsApi.createCompetition({ gymId, competitionRequest }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.competitions.active(gymId) }),
  })
}
