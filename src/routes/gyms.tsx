import { useAuth } from '@/features/auth/useAuth'
import { isAdmin } from '@/features/auth/gymRoles'
import { GymHeader } from '@/features/gyms/components/GymHeader'
import { GymList } from '@/features/gyms/components/GymList'
import { NewGymButton } from '@/features/gyms/components/NewGymButton'

export default function Gyms() {
  const { user } = useAuth()

  return (
    <>
      <GymHeader action={isAdmin(user) ? <NewGymButton /> : null} />
      <GymList />
    </>
  )
}
