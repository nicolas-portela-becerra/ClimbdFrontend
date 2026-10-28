import { useState } from 'react'
import type { HoldDto } from '@api'
import { FINISH_ROLE, START_ROLE, normalizeRole } from '@/shared/lib/holds'

export type EditorHold = {
  // Key inside the editor (stable while editing).
  id: number
  x: number
  y: number
  r: number
  role: number
  // The hold's id on the server, only for holds that were loaded from a saved boulder.
  savedId?: number
}

// Radius of every hold the user marks, as a ratio of the photo width (mockup value).
export const HOLD_RADIUS = 0.045
// A hold can be resized between these radii (ratios of the photo width).
export const MIN_RADIUS = 0.02
export const MAX_RADIUS = 0.15
export const MAX_STARTS = 2
export const MAX_FINISHES = 1

// A hold of a NEW boulder, as sent in the create request.
export function toCreateHoldPayload(hold: EditorHold) {
  return { coordX: hold.x, coordY: hold.y, radiusRatio: hold.r, color: hold.role }
}

// A hold in the update request: all the fields of HoldDto. Holds loaded from the server keep their `id`;
// new holds have none (the backend assigns it). `boulderId` is the boulder being edited, for every hold.
export function toUpdateHoldPayload(hold: EditorHold, boulderId: number): HoldDto {
  return {
    ...(hold.savedId !== undefined ? { id: hold.savedId } : {}),
    boulderId,
    coordX: hold.x,
    coordY: hold.y,
    radiusRatio: hold.r,
    color: hold.role,
  }
}

// Holds of a saved boulder, as the editor's holds (to edit it).
export function holdsFromDto(holds: HoldDto[]): EditorHold[] {
  return holds.flatMap((hold, index) =>
    hold.coordX === undefined || hold.coordY === undefined || hold.radiusRatio === undefined
      ? []
      : [
          {
            id: index + 1,
            ...(hold.id !== undefined ? { savedId: hold.id } : {}),
            x: hold.coordX,
            y: hold.coordY,
            r: hold.radiusRatio,
            role: normalizeRole(hold.color),
          },
        ],
  )
}

type PhotoSize = { width: number; height: number }

// Ratios (0..1) of the photo; the size is needed because distances are measured in pixels.
// Index of the hold under a point (ratios of the photo), or -1. Distances are measured in pixels.
export function findHold(
  holds: EditorHold[],
  point: { x: number; y: number },
  size: PhotoSize,
): number {
  return holds.findIndex(
    (hold) =>
      Math.hypot((hold.x - point.x) * size.width, (hold.y - point.y) * size.height) <
      hold.r * size.width,
  )
}

// New radius while dragging to resize: it grows by how much farther from the hold's centre the finger is
// than where the press started (all distances in photo pixels), within the allowed range.
export function radiusAfterDrag(
  startRadius: number,
  startDistance: number,
  distance: number,
  photoWidth: number,
): number {
  const radius = startRadius + (distance - startDistance) / photoWidth
  return Math.min(MAX_RADIUS, Math.max(MIN_RADIUS, radius))
}

export function tapHolds(
  holds: EditorHold[],
  tap: { x: number; y: number },
  role: number,
  size: PhotoSize,
  nextId: number,
): EditorHold[] {
  const hit = findHold(holds, tap, size)
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

export function useHoldEditor(initialHolds: EditorHold[] = []) {
  const [state, setState] = useState<EditorState>(() => ({
    holds: initialHolds,
    history: [],
    nextId: Math.max(0, ...initialHolds.map((hold) => hold.id)) + 1,
  }))

  return {
    holds: state.holds,
    canUndo: state.history.length > 0,
    // Returns the resulting holds, so the caller can react to a role becoming full.
    tap: (point: { x: number; y: number }, role: number, size: PhotoSize): EditorHold[] => {
      const holds = tapHolds(state.holds, point, role, size, state.nextId)
      setState({ holds, history: [...state.history, state.holds], nextId: state.nextId + 1 })
      return holds
    },
    // Call once when a resize starts on an existing hold, so undo restores its old size.
    beginResize: () =>
      setState((current) => ({ ...current, history: [...current.history, current.holds] })),
    resizeHold: (id: number, radius: number) =>
      setState((current) => ({
        ...current,
        holds: current.holds.map((hold) => (hold.id === id ? { ...hold, r: radius } : hold)),
      })),
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
