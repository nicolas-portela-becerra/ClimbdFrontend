import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import { canManageGym, canSet, isAdmin } from '@/features/auth/gymRoles'
import { refreshRoles } from '@/features/auth/session'
import { useAuth } from '@/features/auth/useAuth'
import { CompetitionRows } from '@/features/competitions/components/CompetitionRows'
import { NewCompetitionModal } from '@/features/competitions/components/NewCompetitionModal'
import { ChangeGymButton } from '@/features/gyms/components/ChangeGymButton'
import { GymWallsHeader } from '@/features/gyms/components/GymWallsHeader'
import { UploadWallModal } from '@/features/walls/components/UploadWallModal'
import { WallList } from '@/features/walls/components/WallList'
import { PlusIcon } from '@/shared/icons'
import { DropdownMenu } from '@/shared/ui/DropdownMenu'

export default function GymWalls() {
  const { gymId } = useParams()
  const location = useLocation()
  const { user, gymRoles } = useAuth()
  const { t } = useTranslation('competitions')
  const [creating, setCreating] = useState<'wall' | 'competition' | null>(null)
  const name = (location.state as { gymName?: string } | null)?.gymName
  const id = Number(gymId)

  // Staff (owner/setter/admin) manage walls and competitions; owner/admin also edit the gym and staff.
  const canSetHere = canSet(user, gymRoles, id)
  const canManageHere = canManageGym(user, gymRoles, id)

  const createMenu = canSetHere ? (
    <>
      <DropdownMenu
        label={t('gymMenu.label')}
        icon={<PlusIcon className="size-6" />}
        buttonClassName="border-2 border-accent bg-accent text-on-accent"
        items={[
          { label: t('gymMenu.newWall'), onSelect: () => setCreating('wall') },
          { label: t('gymMenu.newCompetition'), onSelect: () => setCreating('competition') },
        ]}
      />
      <UploadWallModal open={creating === 'wall'} onClose={() => setCreating(null)} gymId={id} />
      <NewCompetitionModal
        open={creating === 'competition'}
        onClose={() => setCreating(null)}
        gymId={id}
      />
    </>
  ) : null

  const manageMenu = canManageHere ? (
    <ChangeGymButton
      gymId={id}
      isAdmin={isAdmin(user)}
      onStaffChanged={() => void refreshRoles()}
    />
  ) : null

  return (
    <GymWallsHeader
      gymId={id}
      name={name}
      action={
        createMenu || manageMenu ? (
          <div className="flex items-center gap-1">
            {createMenu}
            {manageMenu}
          </div>
        ) : null
      }
    >
      {user?.id !== undefined ? <CompetitionRows gymId={id} userId={user.id} /> : null}
      <WallList gymId={id} canManage={canSetHere} />
    </GymWallsHeader>
  )
}
