import type { ParseKeys } from 'i18next'
import { apiErrorKind } from '@/shared/lib/apiError'

type EditorKey = ParseKeys<'editor'>

// `points`: only for All or Nothing competition boulders (whole number as typed, '' elsewhere).
export type BoulderDetails = { name: string; grade: string; description: string; points?: string }

export type DetailsFormState = {
  ok: boolean
  fieldErrors: Partial<Record<'name' | 'grade' | 'points', EditorKey>>
  formError?: EditorKey
  values: BoulderDetails
}

export function validateDetails(input: {
  name: string
  grade: string
  points?: string | undefined
}): DetailsFormState['fieldErrors'] {
  const errors: DetailsFormState['fieldErrors'] = {}
  if (!input.name.trim()) errors.name = 'errors.nameRequired'
  if (!input.grade) errors.grade = 'errors.gradeRequired'
  if (input.points !== undefined && !/^\d+$/.test(input.points.trim())) {
    errors.points = 'errors.pointsRequired'
  }
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
