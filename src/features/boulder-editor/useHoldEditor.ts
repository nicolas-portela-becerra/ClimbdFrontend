import { useState } from 'react'
import { FINISH_ROLE, START_ROLE } from '@/shared/lib/holds'

export type EditorHold = { id: number; x: number; y: number; r: number; role: number }

// Radius of every hold the user marks, as a ratio of the photo width (mockup value).
export const HOLD_RADIUS = 0.045
export const MAX_STARTS = 2
export const MAX_FINISHES = 1

type PhotoSize = { width: number; height: number }

// Ratios (0..1) of the photo; the size is needed because distances are measured in pixels.
export function tapHolds(
  holds: EditorHold[],
  tap: { x: number; y: number },
  role: number,
  size: PhotoSize,
  nextId: number,
): EditorHold[] {
  const hit = holds.findIndex(
    (hold) =>
      Math.hypot((hold.x - tap.x) * size.width, (hold.y - tap.y) * size.height) <
      hold.r * size.width,
  )
  if (hit < 0) return [...holds, { id: nextId, x: tap.x, y: tap.y, r: HOLD_RADIUS, role }]
  // Tapping a marked hold: same role removes it, another role changes it.
  return holds.flatMap((hold, index) => {
    if (index !== hit) return [hold]
    return hold.role === role ? [] : [{ ...hold, role }]
  })
}

export function countRoles(holds: EditorHold[]): [number, number, number, number] {
  const counts: [number, number, number, number] = [0, 0, 0, 0]
  for (const hold of holds) {
    const role = hold.role as 0 | 1 | 2 | 3
    counts[role] += 1
  }
  return counts
}

export type HoldsError = 'needed' | 'tooManyStarts' | 'tooManyFinishes'

export function validateHolds(holds: EditorHold[]): HoldsError | null {
  const counts = countRoles(holds)
  const starts = counts[START_ROLE]
  const finishes = counts[FINISH_ROLE]
  if (starts < 1 || finishes < 1) return 'needed'
  if (starts > MAX_STARTS) return 'tooManyStarts'
  if (finishes > MAX_FINISHES) return 'tooManyFinishes'
  return null
}

// True when no more holds of this role can be added (start: 2, finish: 1).
export function isRoleFull(holds: EditorHold[], role: number): boolean {
  const counts = countRoles(holds)
  if (role === START_ROLE) return counts[START_ROLE] >= MAX_STARTS
  if (role === FINISH_ROLE) return counts[FINISH_ROLE] >= MAX_FINISHES
  return false
}

type EditorState = { holds: EditorHold[]; history: EditorHold[][]; nextId: number }

export function useHoldEditor() {
  const [state, setState] = useState<EditorState>({ holds: [], history: [], nextId: 1 })

  return {
    holds: state.holds,
    canUndo: state.history.length > 0,
    // Returns the resulting holds, so the caller can react to a role becoming full.
    tap: (point: { x: number; y: number }, role: number, size: PhotoSize): EditorHold[] => {
      const holds = tapHolds(state.holds, point, role, size, state.nextId)
      setState({ holds, history: [...state.history, state.holds], nextId: state.nextId + 1 })
      return holds
    },
    undo: () =>
      setState((current) => {
        const previous = current.history.at(-1)
        if (!previous) return current
        return { ...current, holds: previous, history: current.history.slice(0, -1) }
      }),
    clear: () =>
      setState((current) =>
        current.holds.length === 0
          ? current
          : { ...current, holds: [], history: [...current.history, current.holds] },
      ),
  }
}
