import { Link } from 'react-router-dom'
import type { GymDto } from '@api'
import { ChevronIcon } from '@/shared/icons'
import { Tape } from '@/shared/ui/Tape'
import { GymLogo } from './GymLogo'

// The API sends the logo as base64 without a mime type; the browser sniffs the real format.
function logoSrc(logo: string): string {
  return `data:image/jpeg;base64,${logo}`
}

export function GymRow({ gym }: { gym: GymDto }) {
  const name = gym.name ?? ''
  return (
    <li className="border-b-2 border-line">
      <Link
        to={`/gyms/${gym.id}`}
        state={{ gymName: name }}
        className="grid min-h-16 grid-cols-[4rem_1fr_auto] items-center gap-3 py-3.5 active:bg-surface"
      >
        {gym.logo ? (
          <GymLogo src={logoSrc(gym.logo)} />
        ) : (
          <Tape decorative className="size-16 text-4xl">
            {name.charAt(0).toUpperCase()}
          </Tape>
        )}
        <span className="min-w-0">
          <span className="block font-cond text-xl leading-tight font-bold uppercase">{name}</span>
          {gym.description ? (
            <span className="mt-0.5 line-clamp-2 text-sm text-muted">{gym.description}</span>
          ) : null}
        </span>
        <ChevronIcon className="size-5 text-muted" />
      </Link>
    </li>
  )
}
