import { FetchError, ResponseError } from '@api'

export type ApiErrorKind =
  | 'invalid'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'conflict'
  | 'locked'
  | 'tooManyRequests'
  | 'network'
  | 'unknown'

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
      case 423:
        // Locked: the account exists but is deactivated.
        return 'locked'
      case 429:
        return 'tooManyRequests'
      default:
        return 'unknown'
    }
  }
  // fetch rejects with a TypeError when the network is unreachable; the generated client wraps it.
  if (error instanceof FetchError || error instanceof TypeError) return 'network'
  return 'unknown'
}
