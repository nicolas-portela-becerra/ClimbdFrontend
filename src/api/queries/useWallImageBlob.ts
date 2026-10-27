import { useQuery } from '@tanstack/react-query'
import { wallImagesApi } from '@/api/client'
import { qk } from '@/api/keys'

// The image endpoints need the Bearer token, so <img src> can't load them: the bytes are fetched
// through the authenticated client and cached as a Blob (see docs/auth.md).
export function useWallImageThumbnail(wallImageId: number) {
  return useQuery({
    queryKey: qk.walls.thumbnail(wallImageId),
    queryFn: () => wallImagesApi.getWallImageThumbnail({ wallImageId }),
    staleTime: Infinity,
  })
}

// The full image comes with its pixel size (decoded once), which the holds overlay needs.
export function useWallImageData(wallImageId: number) {
  return useQuery({
    queryKey: qk.walls.data(wallImageId),
    queryFn: async () => {
      const blob = await wallImagesApi.getWallImageData({ wallImageId })
      const bitmap = await createImageBitmap(blob)
      const { width, height } = bitmap
      bitmap.close()
      return { blob, width, height }
    },
    staleTime: Infinity,
  })
}
