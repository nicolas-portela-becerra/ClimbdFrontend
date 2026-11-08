import { describe, expect, it } from 'vitest'
import type { UserDto, UserGymRoleDto } from '@api'
import { canManageGym, canSet, gymRole, isAdmin } from './gymRoles'

const admin = { role: 'ADMIN' } as UserDto
const user = { role: 'USER' } as UserDto

const roles: UserGymRoleDto[] = [
  { gymId: 1, gymName: 'Bloque', role: 'OWNER' },
  { gymId: 2, gymName: 'Otra', role: 'SETTER' },
]

describe('gym role helpers', () => {
  it('recognises admins only by the global role', () => {
    expect(isAdmin(admin)).toBe(true)
    expect(isAdmin(user)).toBe(false)
    expect(isAdmin(null)).toBe(false)
  })

  it('looks up the role in one gym', () => {
    expect(gymRole(roles, 1)).toBe('OWNER')
    expect(gymRole(roles, 2)).toBe('SETTER')
    expect(gymRole(roles, 3)).toBeUndefined()
  })

  it('canSet covers admin, owner and setter of that gym, not staff of another gym', () => {
    expect(canSet(admin, roles, 3)).toBe(true)
    expect(canSet(user, roles, 1)).toBe(true)
    expect(canSet(user, roles, 2)).toBe(true)
    expect(canSet(user, roles, 3)).toBe(false)
  })

  it('canManageGym is admin or owner only', () => {
    expect(canManageGym(admin, roles, 3)).toBe(true)
    expect(canManageGym(user, roles, 1)).toBe(true)
    expect(canManageGym(user, roles, 2)).toBe(false)
    expect(canManageGym(user, roles, 3)).toBe(false)
  })
})
