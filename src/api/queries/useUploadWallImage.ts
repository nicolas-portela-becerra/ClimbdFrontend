import { useMutation, useQueryClient } from '@tanstack/react-query'
import { wallImagesApi } from '@/api/client'
import { qk } from '@/api/keys'

type UploadWallImageInput = { image: Blob; wallName: string; uploadedBy: number }

export function useUploadWallImage(gymId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UploadWallImageInput) => wallImagesApi.uploadWallImage({ gymId, ...input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.walls.list(gymId) }),
  })
}
