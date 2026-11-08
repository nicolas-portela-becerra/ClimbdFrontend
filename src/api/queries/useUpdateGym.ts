import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UpdateGymRequest } from '@api'
import { gymsApi } from '@/api/client'
import { qk } from '@/api/keys'

export function useUpdateGym(gymId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updateGymRequest: UpdateGymRequest) =>
      gymsApi.updateGym({ gymId, updateGymRequest }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: qk.gyms.detail(gymId) }),
        queryClient.invalidateQueries({ queryKey: qk.gyms.list() }),
      ]),
  })
}
