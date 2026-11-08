import { describe, expect, it } from 'vitest'
import {
  addAttempt,
  applyServerStatus,
  emptyEntry,
  hasUnsent,
  logOf,
  removeAttempt,
  toggleTop,
  toResults,
} from './results'

const competition = {
  id: 1,
  gymId: 2,
  name: 'Open',
  type: 'X_ATTEMPTS',
  dateFrom: '2026-11-10T10:00:00Z',
  dateTo: '2026-11-10T14:00:00Z',
}
const start = emptyEntry(competition)

describe('logging', () => {
  it('adds and removes attempts, never below 0, raising the snapshot on every change', () => {
    let entry = addAttempt(addAttempt(start, 5), 5)
    expect(logOf(entry, 5)).toEqual({ attempts: 2, topped: false })
    expect(entry.snapshot).toBe(2)
    entry = removeAttempt(removeAttempt(removeAttempt(entry, 5), 5), 5)
    expect(logOf(entry, 5).attempts).toBe(0)
    expect(entry.snapshot).toBe(4)
  })

  it('counts a top with no attempts as a flash', () => {
    expect(logOf(toggleTop(start, 5), 5)).toEqual({ attempts: 1, topped: true })
  })

  it('locks the attempts of a topped boulder until the top is removed', () => {
    const topped = toggleTop(addAttempt(addAttempt(start, 5), 5), 5)
    expect(addAttempt(topped, 5)).toBe(topped)
    expect(removeAttempt(topped, 5)).toBe(topped)
    const untopped = toggleTop(topped, 5)
    expect(logOf(untopped, 5)).toEqual({ attempts: 2, topped: false })
    expect(logOf(addAttempt(untopped, 5), 5).attempts).toBe(3)
  })

  it('sends only the boulders that were tried', () => {
    const entry = removeAttempt(toggleTop(addAttempt(addAttempt(start, 5), 6), 7), 5)
    expect(toResults(entry)).toEqual([
      { boulderId: 6, attempts: 1, topped: false },
      { boulderId: 7, attempts: 1, topped: true },
    ])
  })
})

describe('applyServerStatus', () => {
  const status = {
    lastSnapshot: 9,
    totalPoints: 18,
    resultsOpenUntil: new Date('2026-11-10T14:05:00Z'),
    results: [{ boulderId: 5, attempts: 3, topped: true, points: 18 }],
  }

  it('takes the server results when they are newer than the phone', () => {
    const entry = applyServerStatus(addAttempt(start, 6), status)
    expect(entry.logs).toEqual({ '5': { attempts: 3, topped: true } })
    expect(entry.snapshot).toBe(9)
    expect(entry.sent?.totalPoints).toBe(18)
    expect(entry.resultsOpenUntil).toBe('2026-11-10T14:05:00.000Z')
    expect(hasUnsent(entry)).toBe(false)
  })

  it('keeps newer phone changes as unsent', () => {
    let entry = start
    for (let i = 0; i < 12; i++) entry = addAttempt(entry, 6)
    const applied = applyServerStatus(entry, status)
    expect(logOf(applied, 6).attempts).toBe(12)
    expect(hasUnsent(applied)).toBe(true)
  })
})
