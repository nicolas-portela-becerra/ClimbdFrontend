import { describe, expect, it } from 'vitest'
import { FINISH_ROLE, HAND_ROLE, START_ROLE } from '@/shared/lib/holds'
import { isRoleFull, tapHolds, validateHolds, type EditorHold } from './useHoldEditor'

const size = { width: 900, height: 1200 }
const hold = (id: number, role: number): EditorHold => ({ id, x: 0.5, y: 0.5, r: 0.045, role })

describe('tapHolds', () => {
  it('adds a hold with the selected role on an empty spot', () => {
    const holds = tapHolds([], { x: 0.2, y: 0.3 }, START_ROLE, size, 7)
    expect(holds).toEqual([{ id: 7, x: 0.2, y: 0.3, r: 0.045, role: START_ROLE }])
  })

  it('removes a hold tapped again with the same role', () => {
    const holds = tapHolds([hold(1, HAND_ROLE)], { x: 0.5, y: 0.5 }, HAND_ROLE, size, 2)
    expect(holds).toEqual([])
  })

  it('changes the role of a hold tapped with another role', () => {
    const holds = tapHolds([hold(1, HAND_ROLE)], { x: 0.5, y: 0.5 }, FINISH_ROLE, size, 2)
    expect(holds).toEqual([{ ...hold(1, FINISH_ROLE) }])
  })
})

describe('validateHolds', () => {
  it('needs at least one start and one finish hold', () => {
    expect(validateHolds([])).toBe('needed')
    expect(validateHolds([hold(1, START_ROLE)])).toBe('needed')
    expect(validateHolds([hold(1, FINISH_ROLE)])).toBe('needed')
  })

  it('accepts 1-2 starts and exactly 1 finish', () => {
    expect(validateHolds([hold(1, START_ROLE), hold(2, FINISH_ROLE)])).toBeNull()
    expect(
      validateHolds([hold(1, START_ROLE), hold(2, START_ROLE), hold(3, FINISH_ROLE)]),
    ).toBeNull()
  })

  it('rejects more than 2 starts or more than 1 finish', () => {
    const starts = [hold(1, START_ROLE), hold(2, START_ROLE), hold(3, START_ROLE)]
    expect(validateHolds([...starts, hold(4, FINISH_ROLE)])).toBe('tooManyStarts')
    expect(validateHolds([hold(1, START_ROLE), hold(2, FINISH_ROLE), hold(3, FINISH_ROLE)])).toBe(
      'tooManyFinishes',
    )
  })
})

describe('isRoleFull', () => {
  it('is full at 2 starts and at 1 finish, never for other roles', () => {
    expect(isRoleFull([hold(1, START_ROLE)], START_ROLE)).toBe(false)
    expect(isRoleFull([hold(1, START_ROLE), hold(2, START_ROLE)], START_ROLE)).toBe(true)
    expect(isRoleFull([hold(1, FINISH_ROLE)], FINISH_ROLE)).toBe(true)
    expect(
      isRoleFull([hold(1, HAND_ROLE), hold(2, HAND_ROLE), hold(3, HAND_ROLE)], HAND_ROLE),
    ).toBe(false)
  })
})
