import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateGymRequest } from '@api'
import { gymsApi } from '@/api/client'
import { qk } from '@/api/keys'

export function useCreateGym() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (createGymRequest: CreateGymRequest) => gymsApi.createGym({ createGymRequest }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.gyms.list() }),
  })
}
