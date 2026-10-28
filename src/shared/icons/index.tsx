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

export function SearchIcon(props: IconProps) {
  return (
    <Icon strokeWidth={2} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" strokeLinecap="round" />
    </Icon>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon strokeWidth={2.2} {...props}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </Icon>
  )
}

export function ChevronIcon(props: IconProps) {
  return (
    <Icon strokeWidth={2.2} {...props}>
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  )
}

export function BackIcon(props: IconProps) {
  return (
    <Icon strokeWidth={2.2} {...props}>
      <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  )
}

export function LockIcon(props: IconProps) {
  return (
    <Icon strokeWidth={2} {...props}>
      <rect x="5" y="11" width="14" height="10" rx="1" strokeLinejoin="round" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </Icon>
  )
}

export function LogoutIcon(props: IconProps) {
  return (
    <Icon strokeWidth={2.2} {...props}>
      <path
        d="M10 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15 8l4 4-4 4M19 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  )
}

export function RotateIcon(props: IconProps) {
  return (
    <Icon strokeWidth={2.2} {...props}>
      <path d="M20 12a8 8 0 1 1-2.8-6.1" strokeLinecap="round" />
      <path d="M20 4v5h-5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  )
}

export function MoreIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="5.5" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="18.5" r="1.8" fill="currentColor" stroke="none" />
    </Icon>
  )
}
