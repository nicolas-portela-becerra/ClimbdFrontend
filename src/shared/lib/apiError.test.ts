import { describe, expect, it } from 'vitest'
import { FetchError, ResponseError } from '@api'
import { apiErrorKind } from './apiError'

describe('apiErrorKind', () => {
  it('treats a failed request (wrapped by the generated client) as a network error', () => {
    expect(apiErrorKind(new FetchError(new TypeError('Failed to fetch')))).toBe('network')
    expect(apiErrorKind(new TypeError('Failed to fetch'))).toBe('network')
  })

  it('maps status codes', () => {
    const error = (status: number) => new ResponseError(new Response(null, { status }))
    expect(apiErrorKind(error(409))).toBe('conflict')
    expect(apiErrorKind(error(429))).toBe('tooManyRequests')
  })
})
