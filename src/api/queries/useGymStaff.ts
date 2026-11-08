import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AddGymStaffRequest } from '@api'
import { gymsApi } from '@/api/client'
import { qk } from '@/api/keys'

export function useGymStaff(gymId: number) {
  return useQuery({
    queryKey: qk.gyms.staff(gymId),
    queryFn: () => gymsApi.listGymStaff({ gymId }),
  })
}

export function useAddGymStaff(gymId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (addGymStaffRequest: AddGymStaffRequest) =>
      gymsApi.addGymStaff({ gymId, addGymStaffRequest }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.gyms.staff(gymId) }),
  })
}

export function useRemoveGymStaff(gymId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: number) => gymsApi.removeGymStaff({ gymId, userId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.gyms.staff(gymId) }),
  })
}
