import type { ParseKeys } from 'i18next'
import { apiErrorKind } from '@/shared/lib/apiError'

type GymsKey = ParseKeys<'gyms'>

export type CreateGymFormState = {
  ok: boolean
  fieldErrors: Partial<Record<'name' | 'logo', GymsKey>>
  formError?: GymsKey
  values: { name: string; location: string; description: string }
}

export const initialCreateGymState: CreateGymFormState = {
  ok: false,
  fieldErrors: {},
  values: { name: '', location: '', description: '' },
}

export function validateGymName(name: string): GymsKey | null {
  return name.trim() ? null : 'form.errors.nameRequired'
}

export function createGymErrorKey(error: unknown): GymsKey {
  switch (apiErrorKind(error)) {
    case 'network':
      return 'form.errors.network'
    case 'invalid':
      return 'form.errors.invalid'
    case 'forbidden':
      return 'form.errors.forbidden'
    default:
      return 'form.errors.unknown'
  }
}
