import { useQuery } from '@tanstack/react-query'
import { bouldersApi } from '@/api/client'
import { qk } from '@/api/keys'

export function useBoulder(boulderId: number, enabled = true) {
  return useQuery({
    queryKey: qk.boulders.detail(boulderId),
    queryFn: () => bouldersApi.getBoulderById({ boulderId }),
    enabled,
  })
}
