import { useQuery } from '@tanstack/react-query'
import { wallImagesApi } from '@/api/client'
import { qk } from '@/api/keys'

export function useWallImage(wallImageId: number, enabled = true) {
  return useQuery({
    queryKey: qk.walls.detail(wallImageId),
    queryFn: () => wallImagesApi.getWallImageById({ wallImageId }),
    enabled,
  })
}
