import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useWallImageData } from '@/api/queries/useWallImageBlob'
import { BackIcon } from '@/shared/icons'
import { AuthImage } from '@/shared/ui/AuthImage'

type WallHeroProps = {
  gymId: number
  wallId: number
  name: string
  // Shown at the top-right of the photo.
  action?: ReactNode
}

export function WallHero({ gymId, wallId, name, action }: WallHeroProps) {
  const { t } = useTranslation('walls')
  const navigate = useNavigate()
  const location = useLocation()
  const image = useWallImageData(wallId)

  return (
    <div className="relative h-100 bg-neutral-800">
      <AuthImage blob={image.data?.blob} alt="" className="object-[50%_45%]" />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black/70 to-transparent"
      />
      <Link
        to={`/gyms/${gymId}`}
        aria-label={t('back')}
        // Going back (not forward to the list again) lets the browser restore the list's scroll position.
        // 'default' is the first entry of the session: nothing to go back to, so the link navigates.
        onClick={(event) => {
          if (location.key === 'default') return
          event.preventDefault()
          void navigate(-1)
        }}
        className="absolute top-3.5 left-3.5 grid size-11 place-items-center bg-ground"
      >
        <BackIcon className="size-6" />
      </Link>
      {action ? <div className="absolute top-3.5 right-3.5">{action}</div> : null}
      <h1 className="absolute right-5 bottom-8 left-5 font-display text-6xl leading-none font-extrabold text-white uppercase [text-shadow:0_2px_0_rgb(0_0_0/0.5)]">
        {name}
      </h1>
    </div>
  )
}
