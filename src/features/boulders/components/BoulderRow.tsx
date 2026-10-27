import { Link } from 'react-router-dom'
import type { BoulderResponseDto } from '@api'
import { GradeTape } from './GradeTape'

type BoulderRowProps = {
  boulder: BoulderResponseDto
  href: string
  replace?: boolean
  // Navigation state to keep (the page reads the wall name from it).
  linkState?: unknown
  onSelect?: () => void
}

export function BoulderRow({ boulder, href, replace, linkState, onSelect }: BoulderRowProps) {
  return (
    <li className="border-b-2 border-line">
      <Link
        to={href}
        replace={replace}
        state={linkState}
        // The page must not jump to the top when a boulder opens over it.
        preventScrollReset
        onClick={onSelect}
        className="grid min-h-16 grid-cols-[5.5rem_1fr] items-center gap-3 py-3.5 active:bg-surface"
      >
        <GradeTape grade={boulder.grade ?? ''} />
        <span className="min-w-0">
          <span className="block font-cond text-xl leading-tight font-bold uppercase">
            {boulder.name}
          </span>
          {boulder.creator ? (
            <span className="mt-0.5 block text-sm text-muted">@{boulder.creator}</span>
          ) : null}
          {boulder.description ? (
            <span className="mt-0.5 line-clamp-1 text-sm text-muted">{boulder.description}</span>
          ) : null}
        </span>
      </Link>
    </li>
  )
}
