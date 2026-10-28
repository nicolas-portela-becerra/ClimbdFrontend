import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'

export type TabItem = {
  label: string
  icon: ReactNode
  to?: string
}

const itemClass =
  'grid justify-items-center gap-0.5 py-2 font-cond text-xs font-bold tracking-wide uppercase'

export function TabBar({ items, label }: { items: TabItem[]; label: string }) {
  return (
    <nav
      aria-label={label}
      className="sticky bottom-0 z-10 grid auto-cols-fr grid-flow-col border-t-2 border-ink bg-ground pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
    >
      {items.map((item) =>
        item.to ? (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => cn(itemClass, isActive ? 'text-ink' : 'text-muted')}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ) : (
          <span
            key={item.label}
            aria-disabled="true"
            className={cn(itemClass, 'text-muted opacity-50')}
          >
            {item.icon}
            {item.label}
          </span>
        ),
      )}
    </nav>
  )
}
