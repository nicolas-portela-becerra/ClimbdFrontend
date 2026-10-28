import { UserDtoRoleEnum } from '@api'
import { useAuth } from '@/features/auth/useAuth'
import { GymHeader } from '@/features/gyms/components/GymHeader'
import { GymList } from '@/features/gyms/components/GymList'
import { NewGymButton } from '@/features/gyms/components/NewGymButton'

export default function Gyms() {
  const { user } = useAuth()
  const adminId = user?.role === UserDtoRoleEnum.Admin ? user.id : undefined

  return (
    <>
      <GymHeader action={adminId !== undefined ? <NewGymButton userId={adminId} /> : null} />
      <GymList />
    </>
  )
}
