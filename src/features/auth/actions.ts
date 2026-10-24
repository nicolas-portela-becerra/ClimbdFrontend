import type { ParseKeys } from 'i18next'
import { apiErrorKind } from '@/shared/lib/apiError'
import { login, register } from './session'

type AuthKey = ParseKeys<'auth'>
type Field = 'name' | 'email' | 'password'

export type AuthFormState = {
  ok: boolean
  fieldErrors: Partial<Record<Field, AuthKey>>
  formError?: AuthKey
  values: { name: string; email: string }
}

export const initialAuthFormState: AuthFormState = {
  ok: false,
  fieldErrors: {},
  values: { name: '', email: '' },
}

const EMAIL = /^\S+@\S+\.\S+$/

export function validateCredentials(
  input: { name?: string; email: string; password: string },
  requireName: boolean,
): Partial<Record<Field, AuthKey>> {
  const errors: Partial<Record<Field, AuthKey>> = {}
  if (requireName && !input.name?.trim()) errors.name = 'errors.nameRequired'
  if (!input.email.trim()) errors.email = 'errors.emailRequired'
  else if (!EMAIL.test(input.email.trim())) errors.email = 'errors.emailInvalid'
  if (!input.password) errors.password = 'errors.passwordRequired'
  return errors
}

function text(data: FormData, key: string): string {
  const value = data.get(key)
  return typeof value === 'string' ? value : ''
}

export async function loginAction(
  _previous: AuthFormState,
  data: FormData,
): Promise<AuthFormState> {
  const email = text(data, 'email').trim()
  const password = text(data, 'password')
  const values = { name: '', email }

  const fieldErrors = validateCredentials({ email, password }, false)
  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors, values }

  try {
    await login(email, password)
    return { ok: true, fieldErrors: {}, values }
  } catch (error) {
    const kind = apiErrorKind(error)
    const formError: AuthKey =
      kind === 'unauthorized'
        ? 'errors.invalidCredentials'
        : kind === 'forbidden'
          ? 'errors.inactive'
          : kind === 'network'
            ? 'errors.network'
            : 'errors.unknown'
    return { ok: false, fieldErrors: {}, formError, values }
  }
}

export async function registerAction(
  _previous: AuthFormState,
  data: FormData,
): Promise<AuthFormState> {
  const name = text(data, 'name').trim()
  const email = text(data, 'email').trim()
  const password = text(data, 'password')
  const values = { name, email }

  const fieldErrors = validateCredentials({ name, email, password }, true)
  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors, values }

  try {
    await register(name, email, password)
    return { ok: true, fieldErrors: {}, values }
  } catch (error) {
    const kind = apiErrorKind(error)
    const formError: AuthKey =
      kind === 'conflict'
        ? 'errors.emailTaken'
        : kind === 'invalid'
          ? 'errors.invalid'
          : kind === 'network'
            ? 'errors.network'
            : 'errors.unknown'
    return { ok: false, fieldErrors: {}, formError, values }
  }
}
