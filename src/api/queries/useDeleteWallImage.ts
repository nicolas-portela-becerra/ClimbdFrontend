import { useMutation, useQueryClient } from '@tanstack/react-query'
import { wallImagesApi } from '@/api/client'
import { qk } from '@/api/keys'

export function useDeleteWallImage(gymId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (wallImageId: number) => wallImagesApi.deleteWallImage({ wallImageId, gymId }),
    onSuccess: async (_result, wallImageId) => {
      queryClient.removeQueries({ queryKey: qk.walls.detail(wallImageId) })
      queryClient.removeQueries({ queryKey: qk.walls.thumbnail(wallImageId) })
      queryClient.removeQueries({ queryKey: qk.walls.data(wallImageId) })
      queryClient.removeQueries({ queryKey: qk.boulders.byWall(wallImageId) })
      await queryClient.invalidateQueries({ queryKey: qk.walls.list(gymId) })
    },
  })
}
