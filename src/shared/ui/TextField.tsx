import { useId, type InputHTMLAttributes } from 'react'
import { useFieldError } from '@/shared/hooks/useFieldError'
import { cn } from '@/shared/lib/cn'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
  error?: string | undefined
}

export function TextField({
  label,
  error: errorProp,
  className,
  id,
  onInput,
  ...props
}: TextFieldProps) {
  const { error, dismiss } = useFieldError(errorProp)
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  return (
    <div className="grid gap-1">
      <label htmlFor={inputId} className="font-cond text-sm font-semibold tracking-wide uppercase">
        {label}
      </label>
      <input
        id={inputId}
        onInput={(event) => {
          dismiss()
          onInput?.(event)
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'min-h-12 border-2 bg-raised px-3 py-3 text-lg text-ink',
          error ? 'border-error' : 'border-line focus:border-ink',
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-sm font-semibold text-error">
          {error}
        </p>
      ) : null}
    </div>
  )
}
