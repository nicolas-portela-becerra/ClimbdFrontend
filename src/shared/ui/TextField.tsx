import { useId, useState, type InputHTMLAttributes } from 'react'
import { useFormStatus } from 'react-dom'
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
  const [dismissed, setDismissed] = useState(false)
  const [wasPending, setWasPending] = useState(false)
  const { pending } = useFormStatus()

  // While submitting, the previous result is stale, so errors stay hidden; the new result brings them back.
  if (pending !== wasPending) {
    setWasPending(pending)
    if (!pending) setDismissed(false)
  }
  const error = dismissed || pending ? undefined : errorProp

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
          setDismissed(true)
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
