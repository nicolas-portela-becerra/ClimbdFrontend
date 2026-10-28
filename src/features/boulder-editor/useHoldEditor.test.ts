import { describe, expect, it } from 'vitest'
import { UpdateBoulderRequestToJSON } from '@api'
import { FINISH_ROLE, HAND_ROLE, START_ROLE } from '@/shared/lib/holds'
import {
  findHold,
  holdsFromDto,
  isRoleFull,
  MAX_RADIUS,
  MIN_RADIUS,
  radiusAfterDrag,
  tapHolds,
  toCreateHoldPayload,
  toUpdateHoldPayload,
  validateHolds,
  type EditorHold,
} from './useHoldEditor'

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

describe('holdsFromDto', () => {
  it('converts saved holds to editor holds (keeping the server id) and skips incomplete ones', () => {
    const holds = holdsFromDto([
      { id: 10, boulderId: 7, coordX: 0.1, coordY: 0.2, radiusRatio: 0.05, color: 3 },
      { id: 11, boulderId: 7, coordX: 0.3, coordY: 0.4, radiusRatio: 0.04 },
      { id: 12, coordX: 0.5 },
    ])
    expect(holds).toEqual([
      { id: 1, savedId: 10, x: 0.1, y: 0.2, r: 0.05, role: FINISH_ROLE },
      { id: 2, savedId: 11, x: 0.3, y: 0.4, r: 0.04, role: HAND_ROLE },
    ])
  })
})

describe('hold payloads', () => {
  it('a new boulder sends position, size and colour only', () => {
    expect(toCreateHoldPayload({ id: 4, x: 0.1, y: 0.2, r: 0.045, role: START_ROLE })).toEqual({
      coordX: 0.1,
      coordY: 0.2,
      radiusRatio: 0.045,
      color: START_ROLE,
    })
  })

  it('an update sends id (only for saved holds), boulderId, coordX, coordY, radiusRatio and color', () => {
    const saved = { id: 1, savedId: 10, x: 0.1, y: 0.2, r: 0.05, role: FINISH_ROLE }
    const added = { id: 2, x: 0.3, y: 0.4, r: 0.045, role: START_ROLE }
    expect(toUpdateHoldPayload(saved, 7)).toEqual({
      id: 10,
      boulderId: 7,
      coordX: 0.1,
      coordY: 0.2,
      radiusRatio: 0.05,
      color: FINISH_ROLE,
    })
    expect(toUpdateHoldPayload(added, 7)).toEqual({
      boulderId: 7,
      coordX: 0.3,
      coordY: 0.4,
      radiusRatio: 0.045,
      color: START_ROLE,
    })
  })

  it('serialises every field of the update request body, including coordX and coordY', () => {
    const body = UpdateBoulderRequestToJSON({
      name: 'B',
      creatorId: 13,
      gymId: 1,
      wallImageId: 2,
      holds: [toUpdateHoldPayload({ id: 1, savedId: 10, x: 0.25, y: 0.75, r: 0.05, role: 1 }, 7)],
    })
    expect(JSON.parse(JSON.stringify(body)).holds).toEqual([
      { id: 10, boulderId: 7, coordX: 0.25, coordY: 0.75, radiusRatio: 0.05, color: 1 },
    ])
  })
})

describe('findHold / radiusAfterDrag', () => {
  const photo = { width: 1000, height: 2000 }
  const holds = [{ id: 1, x: 0.5, y: 0.5, r: 0.05, role: HAND_ROLE }] // radius 50 px

  it('finds the hold under a point, measuring in pixels', () => {
    expect(findHold(holds, { x: 0.52, y: 0.5 }, photo)).toBe(0) // 20 px from the centre
    expect(findHold(holds, { x: 0.6, y: 0.5 }, photo)).toBe(-1) // 100 px away
    expect(findHold(holds, { x: 0.5, y: 0.53 }, photo)).toBe(-1) // 60 px away vertically (height 2000)
  })

  it('grows when the finger moves away from the centre and shrinks when it comes closer', () => {
    expect(radiusAfterDrag(0.05, 40, 70, 1000)).toBeCloseTo(0.08)
    expect(radiusAfterDrag(0.05, 40, 20, 1000)).toBeCloseTo(0.03)
    expect(radiusAfterDrag(0.045, 0, 30, 1000)).toBeCloseTo(0.075) // a new hold starts at its centre
  })

  it('stays between the minimum and maximum radius', () => {
    expect(radiusAfterDrag(0.05, 0, 5000, 1000)).toBe(MAX_RADIUS)
    expect(radiusAfterDrag(0.05, 500, 0, 1000)).toBe(MIN_RADIUS)
  })
})
