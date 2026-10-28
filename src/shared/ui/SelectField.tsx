import { useId, type SelectHTMLAttributes } from 'react'
import { useFieldError } from '@/shared/hooks/useFieldError'
import { cn } from '@/shared/lib/cn'

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  name: string
  error?: string | undefined
}

export function SelectField({
  label,
  error: errorProp,
  className,
  id,
  onChange,
  children,
  ...props
}: SelectFieldProps) {
  const { error, dismiss } = useFieldError(errorProp)
  const generatedId = useId()
  const selectId = id ?? generatedId
  const errorId = `${selectId}-error`

  return (
    <div className="grid gap-1">
      <label htmlFor={selectId} className="font-cond text-sm font-semibold tracking-wide uppercase">
        {label}
      </label>
      <select
        id={selectId}
        onChange={(event) => {
          dismiss()
          onChange?.(event)
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'min-h-12 border-2 bg-raised px-3 py-3 text-lg text-ink',
          error ? 'border-error' : 'border-line focus:border-ink',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p id={errorId} className="text-sm font-semibold text-error">
          {error}
        </p>
      ) : null}
    </div>
  )
}
