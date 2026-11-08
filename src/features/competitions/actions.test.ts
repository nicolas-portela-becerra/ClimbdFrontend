import { describe, expect, it } from 'vitest'
import { CompetitionType } from '@api'
import { emptyCompetitionValues, validateCompetition } from './actions'

const valid = {
  ...emptyCompetitionValues,
  name: ' Winter Open ',
  dateFrom: '2026-12-01T10:00',
  dateTo: '2026-12-01T14:00',
}

describe('validateCompetition', () => {
  it('builds an All or Nothing request without the attempt settings', () => {
    const { errors, request } = validateCompetition(valid)
    expect(errors).toEqual({})
    expect(request).toMatchObject({
      name: 'Winter Open',
      type: CompetitionType.AllOrNothing,
      graceMinutes: 5,
    })
    expect(request).not.toHaveProperty('basePoints')
    expect(request?.dateFrom).toEqual(new Date('2026-12-01T10:00'))
  })

  it('reads the entered times as wall-clock in the gym time zone', () => {
    // Europe/Madrid is UTC+1 in December (no DST), so 10:00 there is 09:00 UTC.
    const { request } = validateCompetition(valid, 'Europe/Madrid')
    expect(request?.dateFrom.toISOString()).toBe('2026-12-01T09:00:00.000Z')
    expect(request?.dateTo.toISOString()).toBe('2026-12-01T13:00:00.000Z')
  })

  it('needs the attempt settings for X Attempts, with the minimum not above the base', () => {
    const type = CompetitionType.XAttempts
    expect(validateCompetition({ ...valid, type }).errors).toEqual({
      basePoints: 'errors.wholeNumber',
      attemptPenalty: 'errors.wholeNumber',
      minPoints: 'errors.wholeNumber',
    })
    const points = { basePoints: '10', attemptPenalty: '2', minPoints: '12' }
    expect(validateCompetition({ ...valid, type, ...points }).errors).toEqual({
      minPoints: 'errors.minAboveBase',
    })
    expect(
      validateCompetition({ ...valid, type, ...points, minPoints: '4' }).request,
    ).toMatchObject({ basePoints: 10, attemptPenalty: 2, minPoints: 4 })
  })

  it('rejects missing fields and an end before the start', () => {
    expect(validateCompetition(emptyCompetitionValues).errors).toEqual({
      name: 'errors.nameRequired',
      dateFrom: 'errors.dateRequired',
      dateTo: 'errors.dateRequired',
    })
    expect(validateCompetition({ ...valid, dateTo: valid.dateFrom }).errors).toEqual({
      dateTo: 'errors.endBeforeStart',
    })
  })
})
