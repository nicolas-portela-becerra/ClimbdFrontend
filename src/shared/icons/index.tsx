import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Icon(props: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" {...props} />
}

export function WallsIcon(props: IconProps) {
  return (
    <Icon strokeWidth={2} {...props}>
      <path d="M4 20V5l16-1v16z" strokeLinejoin="round" />
      <circle cx="9" cy="9" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="13" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="10" cy="16" r="1.2" fill="currentColor" stroke="none" />
    </Icon>
  )
}

export function LogbookIcon(props: IconProps) {
  return (
    <Icon strokeWidth={2} {...props}>
      <path d="M6 3h11a1 1 0 0 1 1 1v17l-3-2-3 2-3-2-3 2V4a1 1 0 0 1 1-1z" strokeLinejoin="round" />
      <path d="M9 9.5l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <Icon strokeWidth={2.4} {...props}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </Icon>
  )
}

export function MeIcon(props: IconProps) {
  return (
    <Icon strokeWidth={2} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" strokeLinecap="round" />
    </Icon>
  )
}
