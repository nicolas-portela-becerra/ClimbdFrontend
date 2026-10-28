import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { HoldDto } from '@api'
import { bouldersApi } from '@/api/client'
import { qk } from '@/api/keys'

type UpdateBoulderInput = {
  boulderId: number
  name: string
  grade: string
  description: string
  creatorId: number
  gymId: number
  wallImageId: number
  // The boulder's holds after editing: the backend replaces all its holds with these.
  holds: HoldDto[]
}

export function useUpdateBoulder(wallImageId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      boulderId,
      name,
      grade,
      description,
      creatorId,
      gymId,
      wallImageId: boulderWallImageId,
      holds,
    }: UpdateBoulderInput) =>
      bouldersApi.updateBoulder({
        boulderId,
        // An emptied description is sent as "" (the generated type has no null).
        updateBoulderRequest: {
          name,
          grade,
          description,
          creatorId,
          gymId,
          wallImageId: boulderWallImageId,
          holds,
        },
      }),
    onSuccess: (_boulder, { boulderId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: qk.boulders.byWall(wallImageId) }),
        queryClient.invalidateQueries({ queryKey: qk.boulders.detail(boulderId) }),
      ]),
  })
}
