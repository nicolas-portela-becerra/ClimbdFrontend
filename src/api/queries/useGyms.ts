import { useInfiniteQuery } from '@tanstack/react-query'
import { gymsApi } from '@/api/client'
import { qk } from '@/api/keys'

export const GYMS_PAGE_SIZE = 20

// Pages are fetched one at a time (page is 0-based); `last` tells when there are no more.
export function useGyms() {
  return useInfiniteQuery({
    queryKey: qk.gyms.list(),
    queryFn: ({ pageParam }) => gymsApi.listGyms({ page: pageParam, size: GYMS_PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : (lastPage.number ?? 0) + 1),
  })
}
