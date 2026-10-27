import { useQuery } from '@tanstack/react-query'
import { gymsApi } from '@/api/client'
import { qk } from '@/api/keys'

export function useGym(gymId: number, enabled = true) {
  return useQuery({
    queryKey: qk.gyms.detail(gymId),
    queryFn: () => gymsApi.getGymById({ gymId }),
    enabled,
  })
}
