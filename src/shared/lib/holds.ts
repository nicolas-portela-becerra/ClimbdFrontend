// HoldDto.color / CreateHoldRequest.color: 0 start, 1 hand, 2 foot, 3 finish.
export const HOLD_ROLES = ['start', 'hand', 'foot', 'finish'] as const
export type HoldRoleName = (typeof HOLD_ROLES)[number]

export const START_ROLE = 0
export const HAND_ROLE = 1
export const FOOT_ROLE = 2
export const FINISH_ROLE = 3

// Full class names so Tailwind can see them.
export const ROLE_STROKE = ['stroke-start', 'stroke-hand', 'stroke-foot', 'stroke-finish'] as const
export const ROLE_BORDER = ['border-start', 'border-hand', 'border-foot', 'border-finish'] as const

// A hold without a (valid) colour is treated as a plain hand hold.
export function normalizeRole(color: number | null | undefined): number {
  return color !== null && color !== undefined && color >= 0 && color < HOLD_ROLES.length
    ? color
    : HAND_ROLE
}
