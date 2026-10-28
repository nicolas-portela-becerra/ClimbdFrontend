import type { ParseKeys } from 'i18next'
import { apiErrorKind } from '@/shared/lib/apiError'
import { login, register } from './session'

type AuthKey = ParseKeys<'auth'>
type Field = 'name' | 'email' | 'confirmEmail' | 'password' | 'confirmPassword'

export type AuthFormState = {
  ok: boolean
  fieldErrors: Partial<Record<Field, AuthKey>>
  formError?: AuthKey
  values: { name: string; email: string; confirmEmail: string }
}

export const initialAuthFormState: AuthFormState = {
  ok: false,
  fieldErrors: {},
  values: { name: '', email: '', confirmEmail: '' },
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

// Sign-up asks for the email and the password twice. Emails are compared ignoring case and
// surrounding spaces; passwords exactly. A repeat field is only checked when its first field is fine.
export function validateConfirmations(
  input: { email: string; confirmEmail: string; password: string; confirmPassword: string },
  firstErrors: Partial<Record<Field, AuthKey>>,
): Partial<Record<Field, AuthKey>> {
  const errors: Partial<Record<Field, AuthKey>> = {}
  if (
    !firstErrors.email &&
    input.email.trim().toLowerCase() !== input.confirmEmail.trim().toLowerCase()
  ) {
    errors.confirmEmail = 'errors.emailMismatch'
  }
  if (!firstErrors.password && input.password !== input.confirmPassword) {
    errors.confirmPassword = 'errors.passwordMismatch'
  }
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
  const values = { name: '', email, confirmEmail: '' }

  const fieldErrors = validateCredentials({ email, password }, false)
  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors, values }

  try {
    await login(email, password)
    return { ok: true, fieldErrors: {}, values }
  } catch (error) {
    return { ok: false, fieldErrors: {}, formError: loginErrorKey(error), values }
  }
}

// 401: wrong credentials. 423 (Locked): the account exists but is deactivated.
export function loginErrorKey(error: unknown): AuthKey {
  switch (apiErrorKind(error)) {
    case 'unauthorized':
      return 'errors.invalidCredentials'
    case 'locked':
      return 'errors.notActivated'
    case 'forbidden':
      return 'errors.inactive'
    case 'network':
      return 'errors.network'
    default:
      return 'errors.unknown'
  }
}

export async function registerAction(
  _previous: AuthFormState,
  data: FormData,
): Promise<AuthFormState> {
  const name = text(data, 'name').trim()
  const email = text(data, 'email').trim()
  const confirmEmail = text(data, 'confirmEmail').trim()
  const password = text(data, 'password')
  const confirmPassword = text(data, 'confirmPassword')
  const values = { name, email, confirmEmail }

  const firstErrors = validateCredentials({ name, email, password }, true)
  const fieldErrors = {
    ...firstErrors,
    ...validateConfirmations({ email, confirmEmail, password, confirmPassword }, firstErrors),
  }
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
