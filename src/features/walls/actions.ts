import type { ParseKeys } from 'i18next'
import { ResponseError } from '@api'
import { apiErrorKind } from '@/shared/lib/apiError'

type WallsKey = ParseKeys<'walls'>

export type UploadFormState = {
  ok: boolean
  fieldErrors: Partial<Record<'name' | 'photo', WallsKey>>
  formError?: WallsKey
  values: { name: string }
}

export const initialUploadState: UploadFormState = {
  ok: false,
  fieldErrors: {},
  values: { name: '' },
}

export function validateWallName(name: string): WallsKey | null {
  return name.trim() ? null : 'errors.nameRequired'
}

export function uploadErrorKey(error: unknown): WallsKey {
  // 413: the file is over a server limit before it even reaches the API.
  if (error instanceof ResponseError && error.response.status === 413) return 'errors.tooLarge'
  switch (apiErrorKind(error)) {
    case 'network':
      return 'errors.network'
    case 'invalid':
      return 'errors.invalidPhoto'
    case 'forbidden':
      return 'errors.forbidden'
    default:
      return 'errors.unknown'
  }
}
