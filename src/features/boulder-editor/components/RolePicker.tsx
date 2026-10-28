import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'
import { FOOT_ROLE, HOLD_ROLES, ROLE_BORDER } from '@/shared/lib/holds'

type RolePickerProps = {
  role: number
  counts: number[]
  // Roles that can't take more holds.
  fullRoles: number[]
  onChange: (role: number) => void
}

export function RolePicker({ role, counts, fullRoles, onChange }: RolePickerProps) {
  const { t } = useTranslation('editor')

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {HOLD_ROLES.map((name, index) => (
        <button
          key={name}
          type="button"
          aria-pressed={index === role}
          disabled={fullRoles.includes(index)}
          onClick={() => onChange(index)}
          className={cn(
            'grid min-h-20 justify-items-center gap-1 border-2 px-1 pt-2.5 pb-2 font-cond text-sm font-bold uppercase',
            'transition-[scale,background-color] duration-150 ease-out active:scale-95 motion-reduce:active:scale-100',
            'disabled:opacity-40 disabled:active:scale-100',
            index === role
              ? 'border-ink bg-raised shadow-[inset_0_-4px_0_var(--ink)]'
              : 'border-line bg-surface',
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'size-6 rounded-full border-4',
              ROLE_BORDER[index],
              index === FOOT_ROLE && 'border-dashed',
            )}
          />
          <b className="font-display text-2xl leading-none font-black">{counts[index]}</b>
          {t(`roles.${name}`)}
        </button>
      ))}
    </div>
  )
}
