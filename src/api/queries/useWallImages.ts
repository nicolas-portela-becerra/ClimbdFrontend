import { useInfiniteQuery } from '@tanstack/react-query'
import { wallImagesApi } from '@/api/client'
import { qk } from '@/api/keys'

export const WALLS_PAGE_SIZE = 20

// Kept longer than the default 5 min so going back to a long list finds every loaded page (scroll restore).
const WALLS_LIST_GC_MS = 30 * 60_000

export function useWallImages(gymId: number, enabled = true) {
  return useInfiniteQuery({
    queryKey: qk.walls.list(gymId),
    queryFn: ({ pageParam }) =>
      wallImagesApi.listWallImages({ gymId, page: pageParam, size: WALLS_PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : (lastPage.number ?? 0) + 1),
    gcTime: WALLS_LIST_GC_MS,
    enabled,
  })
}
