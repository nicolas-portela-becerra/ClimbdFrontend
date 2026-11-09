import type { UserDto, UserGymRoleDto } from '@api'
import { GymRole, UserDtoRoleEnum } from '@api'

// Pure permission helpers, kept together and documented so components ask the same questions.
// Global roles and per-gym roles come from different places: user.role is global, gymRoles is per gym.

export function isAdmin(user: UserDto | null | undefined): boolean {
  return user?.role === UserDtoRoleEnum.Admin
}

// The user's role inside one gym, or undefined when they are a plain climber there.
export function gymRole(gymRoles: UserGymRoleDto[], gymId: number): GymRole | undefined {
  return gymRoles.find((role) => role.gymId === gymId)?.role
}

// Manages the gym: its settings and its staff. Admin or OWNER.
export function canManageGym(
  user: UserDto | null | undefined,
  gymRoles: UserGymRoleDto[],
  gymId: number,
): boolean {
  return isAdmin(user) || gymRole(gymRoles, gymId) === GymRole.Owner
}

// Runs the gym's climbing content: walls, competitions and every boulder. Admin, OWNER or SETTER.
export function canSet(
  user: UserDto | null | undefined,
  gymRoles: UserGymRoleDto[],
  gymId: number,
): boolean {
  return isAdmin(user) || gymRole(gymRoles, gymId) !== undefined
}
