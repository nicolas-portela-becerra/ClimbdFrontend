import type { ReactNode } from 'react'
import { Button } from './Button'

type ErrorStateProps = {
  title: string
  message: string
  action?: { label: string; onClick: () => void } | undefined
  children?: ReactNode
}

export function ErrorState({ title, message, action, children }: ErrorStateProps) {
  return (
    <div role="alert" className="grid justify-items-center gap-3 px-5 py-16 text-center">
      <h1 className="font-display text-4xl font-extrabold uppercase">{title}</h1>
      <p className="text-muted">{message}</p>
      {action ? (
        <Button variant="primary" onClick={action.onClick} className="mt-3 max-w-xs">
          {action.label}
        </Button>
      ) : null}
      {children}
    </div>
  )
}
