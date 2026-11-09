import { describe, expect, it } from 'vitest'
import { safeNext } from './safeNext'

const ORIGIN = 'https://climbd.test'

describe('safeNext', () => {
  it('keeps internal paths with their query and hash', () => {
    expect(safeNext('/gyms/3/walls/7?boulder=9#x', ORIGIN)).toBe('/gyms/3/walls/7?boulder=9#x')
  })

  it.each([
    null,
    '',
    '//evil.com',
    '/\\evil.com',
    '/\t/evil.com',
    '/\n/evil.com',
    'https://evil.com/gyms',
    'javascript:alert(1)',
    '/login?next=/gyms',
  ])('falls back to /gyms for %j', (next) => {
    expect(safeNext(next, ORIGIN)).toBe('/gyms')
  })
})
