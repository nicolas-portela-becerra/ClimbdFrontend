import { afterEach, describe, expect, it } from 'vitest'
import { forgetSentEntries, getEntry, updateEntry } from './entryStore'
import { emptyEntry, type SendState } from './results'

const competition = (id: number) => ({
  id,
  gymId: 2,
  name: 'Open',
  type: 'X_ATTEMPTS',
  dateFrom: new Date().toISOString(),
  dateTo: new Date().toISOString(),
})

const save = (userId: number, id: number, send: SendState) =>
  updateEntry(userId, id, () => ({ ...emptyEntry(competition(id)), send }))

afterEach(() => localStorage.clear())

describe('forgetSentEntries', () => {
  it("drops the user's synced entries, keeps pending ones and other users' data", () => {
    save(1, 10, 'idle')
    save(1, 11, 'closed')
    save(1, 12, 'pending')
    save(2, 10, 'idle')

    forgetSentEntries(1)

    expect(getEntry(1, 10)).toBeUndefined()
    expect(getEntry(1, 11)).toBeUndefined()
    expect(getEntry(1, 12)?.send).toBe('pending')
    expect(getEntry(2, 10)).toBeDefined()
    expect(localStorage.getItem('climbd.competition.1.10')).toBeNull()
  })
})
