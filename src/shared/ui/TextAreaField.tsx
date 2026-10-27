import { useId, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  name: string
}

export function TextAreaField({ label, className, id, ...props }: TextAreaFieldProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId

  return (
    <div className="grid gap-1">
      <label
        htmlFor={textareaId}
        className="font-cond text-sm font-semibold tracking-wide uppercase"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        rows={3}
        className={cn(
          'min-h-12 resize-none border-2 border-line bg-raised px-3 py-3 text-lg text-ink focus:border-ink',
          className,
        )}
        {...props}
      />
    </div>
  )
}
