import { useInfiniteQuery } from '@tanstack/react-query'
import { bouldersApi } from '@/api/client'
import { qk } from '@/api/keys'

export const BOULDERS_PAGE_SIZE = 20

// Kept longer than the default 5 min so going back to a long list finds every loaded page (scroll restore).
const BOULDERS_LIST_GC_MS = 30 * 60_000

export function useBouldersByWall(wallImageId: number) {
  return useInfiniteQuery({
    queryKey: qk.boulders.byWall(wallImageId),
    queryFn: ({ pageParam }) =>
      bouldersApi.listBouldersByWall({ wallImageId, page: pageParam, size: BOULDERS_PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : (lastPage.number ?? 0) + 1),
    gcTime: BOULDERS_LIST_GC_MS,
  })
}
