import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query'
import type { BoulderWithUserPageResponse } from '@api'
import { bouldersApi } from '@/api/client'
import { qk } from '@/api/keys'

export function useDeleteBoulder(wallImageId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (boulderId: number) => bouldersApi.deleteBoulder({ boulderId }),
    // The deleted boulder leaves every loaded page of the wall's list.
    onSuccess: (_result, boulderId) => {
      queryClient.setQueryData<InfiniteData<BoulderWithUserPageResponse>>(
        qk.boulders.byWall(wallImageId),
        (current) =>
          current && {
            ...current,
            pages: current.pages.map((page) => ({
              ...page,
              content: page.content?.filter((boulder) => boulder.id !== boulderId),
            })),
          },
      )
      queryClient.removeQueries({ queryKey: qk.boulders.detail(boulderId) })
    },
  })
}
