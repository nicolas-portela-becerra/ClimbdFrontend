import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { CompetitionRows } from '@/features/competitions/components/CompetitionRows'
import { NewCompetitionModal } from '@/features/competitions/components/NewCompetitionModal'
import { GymWallsHeader } from '@/features/gyms/components/GymWallsHeader'
import { UploadWallModal } from '@/features/walls/components/UploadWallModal'
import { WallList } from '@/features/walls/components/WallList'
import { PlusIcon } from '@/shared/icons'
import { DropdownMenu } from '@/shared/ui/DropdownMenu'

export default function GymWalls() {
  const { gymId } = useParams()
  const location = useLocation()
  const { user } = useAuth()
  const { t } = useTranslation('competitions')
  const [creating, setCreating] = useState<'wall' | 'competition' | null>(null)
  const name = (location.state as { gymName?: string } | null)?.gymName
  const id = Number(gymId)

  return (
    <GymWallsHeader
      gymId={id}
      name={name}
      action={
        user?.id !== undefined ? (
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
            <UploadWallModal
              open={creating === 'wall'}
              onClose={() => setCreating(null)}
              gymId={id}
              userId={user.id}
            />
            <NewCompetitionModal
              open={creating === 'competition'}
              onClose={() => setCreating(null)}
              gymId={id}
            />
          </>
        ) : null
      }
    >
      {user?.id !== undefined ? <CompetitionRows gymId={id} userId={user.id} /> : null}
      <WallList gymId={id} />
    </GymWallsHeader>
  )
}
