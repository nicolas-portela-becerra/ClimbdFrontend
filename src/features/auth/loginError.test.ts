import { describe, expect, it } from 'vitest'
import { ResponseError } from '@api'
import { loginErrorKey } from './actions'

const failure = (status: number) => new ResponseError(new Response(null, { status }))

describe('loginErrorKey', () => {
  it('shows wrong credentials for 401', () => {
    expect(loginErrorKey(failure(401))).toBe('errors.invalidCredentials')
  })

  it('shows not activated for 423 (locked)', () => {
    expect(loginErrorKey(failure(423))).toBe('errors.notActivated')
  })

  it('maps other failures', () => {
    expect(loginErrorKey(failure(403))).toBe('errors.inactive')
    expect(loginErrorKey(failure(500))).toBe('errors.unknown')
    expect(loginErrorKey(new TypeError('Failed to fetch'))).toBe('errors.network')
  })
})
