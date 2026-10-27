import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateBoulderRequest } from '@api'
import { bouldersApi } from '@/api/client'
import { qk } from '@/api/keys'

export function useCreateBoulder(gymId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (createBoulderRequest: CreateBoulderRequest) =>
      bouldersApi.createBoulder({ gymId, createBoulderRequest }),
    onSuccess: (_boulder, request) =>
      queryClient.invalidateQueries({ queryKey: qk.boulders.byWall(request.wallImageId) }),
  })
}
