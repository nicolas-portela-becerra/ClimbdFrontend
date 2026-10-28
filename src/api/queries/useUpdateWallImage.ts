import { useMutation, useQueryClient } from '@tanstack/react-query'
import { wallImagesApi } from '@/api/client'
import { qk } from '@/api/keys'

type UpdateWallImageInput = { wallImageId: number; wallName: string; image?: Blob }

export function useUpdateWallImage(gymId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateWallImageInput) => wallImagesApi.updateWallImage({ ...input, gymId }),
    // A new photo changes the thumbnail and the full image too.
    onSuccess: (_result, { wallImageId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: qk.walls.list(gymId) }),
        queryClient.invalidateQueries({ queryKey: qk.walls.detail(wallImageId) }),
        queryClient.invalidateQueries({ queryKey: qk.walls.thumbnail(wallImageId) }),
        queryClient.invalidateQueries({ queryKey: qk.walls.data(wallImageId) }),
      ]),
  })
}
