import { useQuery } from '@tanstack/react-query'
import { usersApi } from '@/api/client'
import { qk } from '@/api/keys'

// The API returns every deactivated user at once (it has no pagination).
export function useDeactivatedUsers() {
  return useQuery({
    queryKey: qk.users.deactivated(),
    queryFn: () => usersApi.getDeactivated(),
  })
}
