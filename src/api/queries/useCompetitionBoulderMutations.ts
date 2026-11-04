import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CompetitionBoulderRequest } from '@api'
import { competitionsApi } from '@/api/client'
import { qk } from '@/api/keys'

export function useCreateCompetitionBoulder(competitionId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (competitionBoulderRequest: CompetitionBoulderRequest) =>
      competitionsApi.createCompetitionBoulder({ competitionId, competitionBoulderRequest }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: qk.competitions.boulders(competitionId) }),
  })
}

export function useUpdateCompetitionBoulder(competitionId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { boulderId: number; request: CompetitionBoulderRequest }) =>
      competitionsApi.updateCompetitionBoulder({
        competitionId,
        boulderId: input.boulderId,
        competitionBoulderRequest: input.request,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: qk.competitions.boulders(competitionId) }),
  })
}

export function useDeleteCompetitionBoulder(competitionId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (boulderId: number) =>
      competitionsApi.deleteCompetitionBoulder({ competitionId, boulderId }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: qk.competitions.boulders(competitionId) }),
  })
}
