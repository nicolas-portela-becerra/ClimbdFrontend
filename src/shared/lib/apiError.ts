import { ResponseError } from '@api'

export type ApiErrorKind =
  'invalid' | 'unauthorized' | 'forbidden' | 'notFound' | 'conflict' | 'network' | 'unknown'

export function apiErrorKind(error: unknown): ApiErrorKind {
  if (error instanceof ResponseError) {
    switch (error.response.status) {
      case 400:
        return 'invalid'
      case 401:
        return 'unauthorized'
      case 403:
        return 'forbidden'
      case 404:
        return 'notFound'
      case 409:
        return 'conflict'
      default:
        return 'unknown'
    }
  }
  // fetch rejects with a TypeError when the network is unreachable
  if (error instanceof TypeError) return 'network'
  return 'unknown'
}
