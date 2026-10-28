import { describe, expect, it } from 'vitest'
import { validateConfirmations } from './actions'

const ok = {
  email: 'marta@x.com',
  confirmEmail: 'marta@x.com',
  password: 'secret',
  confirmPassword: 'secret',
}

describe('validateConfirmations', () => {
  it('accepts matching pairs', () => {
    expect(validateConfirmations(ok, {})).toEqual({})
  })

  it('compares emails ignoring case and spaces', () => {
    expect(validateConfirmations({ ...ok, confirmEmail: '  Marta@X.com ' }, {})).toEqual({})
  })

  it('compares passwords exactly', () => {
    expect(validateConfirmations({ ...ok, confirmPassword: 'Secret' }, {})).toEqual({
      confirmPassword: 'errors.passwordMismatch',
    })
  })

  it('flags both mismatches, including an empty repeat field', () => {
    expect(
      validateConfirmations({ ...ok, confirmEmail: 'other@x.com', confirmPassword: '' }, {}),
    ).toEqual({ confirmEmail: 'errors.emailMismatch', confirmPassword: 'errors.passwordMismatch' })
  })

  it('skips a repeat field when its first field already has an error', () => {
    expect(
      validateConfirmations(
        { ...ok, confirmEmail: 'x', confirmPassword: 'y' },
        { email: 'errors.emailInvalid', password: 'errors.passwordRequired' },
      ),
    ).toEqual({})
  })
})
