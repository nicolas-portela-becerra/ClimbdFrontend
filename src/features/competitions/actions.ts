import type { ParseKeys } from 'i18next'
import { CompetitionType, type CompetitionRequest } from '@api'
import { apiErrorKind } from '@/shared/lib/apiError'

type Key = ParseKeys<'competitions'>

export type CompetitionField =
  'name' | 'dateFrom' | 'dateTo' | 'graceMinutes' | 'basePoints' | 'attemptPenalty' | 'minPoints'

export type CompetitionFormValues = Record<CompetitionField | 'type', string>

export const DEFAULT_GRACE_MINUTES = '5'

export const emptyCompetitionValues: CompetitionFormValues = {
  name: '',
  type: CompetitionType.AllOrNothing,
  dateFrom: '',
  dateTo: '',
  graceMinutes: DEFAULT_GRACE_MINUTES,
  basePoints: '',
  attemptPenalty: '',
  minPoints: '',
}

// A whole number >= 0, or null.
function count(value: string): number | null {
  if (!/^\d+$/.test(value.trim())) return null
  return Number(value.trim())
}

export function validateCompetition(values: CompetitionFormValues): {
  errors: Partial<Record<CompetitionField, Key>>
  request: CompetitionRequest | null
} {
  const errors: Partial<Record<CompetitionField, Key>> = {}
  const name = values.name.trim()
  if (!name) errors.name = 'errors.nameRequired'

  // datetime-local values are in the phone's time zone; Date turns them into an instant.
  const from = values.dateFrom ? new Date(values.dateFrom) : null
  const to = values.dateTo ? new Date(values.dateTo) : null
  if (!from || Number.isNaN(from.getTime())) errors.dateFrom = 'errors.dateRequired'
  if (!to || Number.isNaN(to.getTime())) errors.dateTo = 'errors.dateRequired'
  else if (from && to <= from) errors.dateTo = 'errors.endBeforeStart'

  const grace = count(values.graceMinutes)
  if (grace === null) errors.graceMinutes = 'errors.wholeNumber'

  const xAttempts = values.type === CompetitionType.XAttempts
  const base = count(values.basePoints)
  const penalty = count(values.attemptPenalty)
  const min = count(values.minPoints)
  if (xAttempts) {
    if (base === null) errors.basePoints = 'errors.wholeNumber'
    if (penalty === null) errors.attemptPenalty = 'errors.wholeNumber'
    if (min === null) errors.minPoints = 'errors.wholeNumber'
    else if (base !== null && min > base) errors.minPoints = 'errors.minAboveBase'
  }

  if (Object.keys(errors).length > 0 || !from || !to || grace === null) {
    return { errors, request: null }
  }
  const request: CompetitionRequest = {
    name,
    type: xAttempts ? CompetitionType.XAttempts : CompetitionType.AllOrNothing,
    dateFrom: from,
    dateTo: to,
    graceMinutes: grace,
  }
  if (xAttempts && base !== null && penalty !== null && min !== null) {
    request.basePoints = base
    request.attemptPenalty = penalty
    request.minPoints = min
  }
  return { errors, request }
}

export function createErrorKey(error: unknown): Key {
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
