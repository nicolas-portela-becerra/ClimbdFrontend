import type { ParseKeys } from 'i18next'
import { apiErrorKind } from '@/shared/lib/apiError'

type EditorKey = ParseKeys<'editor'>

export type DetailsFormState = {
  ok: boolean
  fieldErrors: Partial<Record<'name' | 'grade', EditorKey>>
  formError?: EditorKey
  values: { name: string; grade: string; description: string }
}

export const initialDetailsState: DetailsFormState = {
  ok: false,
  fieldErrors: {},
  values: { name: '', grade: '', description: '' },
}

export function validateDetails(input: {
  name: string
  grade: string
}): DetailsFormState['fieldErrors'] {
  const errors: DetailsFormState['fieldErrors'] = {}
  if (!input.name.trim()) errors.name = 'errors.nameRequired'
  if (!input.grade) errors.grade = 'errors.gradeRequired'
  return errors
}

export function saveErrorKey(error: unknown): EditorKey {
  switch (apiErrorKind(error)) {
    case 'network':
      return 'errors.network'
    case 'invalid':
      return 'errors.invalid'
    case 'forbidden':
      return 'errors.forbidden'
    default:
      return 'errors.unknown'
  }
}
