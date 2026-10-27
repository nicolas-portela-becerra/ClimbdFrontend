import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { DeactivatedUsersResponse } from '@api'
import { usersApi } from '@/api/client'
import { qk } from '@/api/keys'

export function useActivateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: number) => usersApi.activateUsers({ requestBody: [userId] }),
    // The activated user leaves the list of deactivated users.
    onSuccess: (_result, userId) =>
      queryClient.setQueryData<DeactivatedUsersResponse>(qk.users.deactivated(), (current) =>
        current
          ? { ...current, users: current.users?.filter((user) => user.id !== userId) }
          : current,
      ),
  })
}
