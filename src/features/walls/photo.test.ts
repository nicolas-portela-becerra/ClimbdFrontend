import { describe, expect, it } from 'vitest'
import { MAX_UPLOAD_BYTES, validatePhoto } from './photo'

const file = (type: string, size: number) => {
  const blob = new Blob([new Uint8Array(size)], { type })
  return blob
}

describe('validatePhoto', () => {
  it('accepts JPEG, PNG and WebP up to 5 MB', () => {
    expect(validatePhoto(file('image/jpeg', 1000))).toBeNull()
    expect(validatePhoto(file('image/png', 1000))).toBeNull()
    expect(validatePhoto(file('image/webp', MAX_UPLOAD_BYTES))).toBeNull()
  })

  it('rejects other types and files over 5 MB', () => {
    expect(validatePhoto(file('image/gif', 1000))).toBe('errors.wrongType')
    expect(validatePhoto(file('image/jpeg', MAX_UPLOAD_BYTES + 1))).toBe('errors.tooLarge')
  })
})
