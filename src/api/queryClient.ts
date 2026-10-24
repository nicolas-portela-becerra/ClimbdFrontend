import { QueryClient } from '@tanstack/react-query'
import { ResponseError } from '@api'

const NO_RETRY_STATUS = [401, 403, 404]

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: (failureCount, error) => {
        if (error instanceof ResponseError && NO_RETRY_STATUS.includes(error.response.status)) {
          return false
        }
        return failureCount < 1
      },
    },
  },
})
