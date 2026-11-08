import { useMutation, useQueryClient } from '@tanstack/react-query'
import { gymsApi } from '@/api/client'
import { qk } from '@/api/keys'

export function useDeleteGym() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (gymId: number) => gymsApi.deleteGym({ gymId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.gyms.list() }),
  })
}
