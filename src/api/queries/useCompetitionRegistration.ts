import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CompetitionSection } from '@api'
import { competitionsApi } from '@/api/client'
import { qk } from '@/api/keys'

// Register / unregister the current user. Both refresh the gym's competitions (the `registered` flag).
export function useRegisterForCompetition(gymId: number, competitionId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (section: CompetitionSection) =>
      competitionsApi.registerForCompetition({
        competitionId,
        competitionRegistrationRequest: { section },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.competitions.active(gymId) }),
  })
}

export function useUnregisterFromCompetition(gymId: number, competitionId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => competitionsApi.unregisterFromCompetition({ competitionId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.competitions.active(gymId) }),
  })
}
