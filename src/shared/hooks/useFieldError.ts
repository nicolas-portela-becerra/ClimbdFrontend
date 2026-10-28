import { useState } from 'react'
import { useFormStatus } from 'react-dom'

// Form field errors: hidden while the form is submitting (the previous result is stale), shown again
// when the new result arrives, and hidden as soon as the user types in the field.
export function useFieldError(error: string | undefined) {
  const [dismissed, setDismissed] = useState(false)
  const [wasPending, setWasPending] = useState(false)
  const { pending } = useFormStatus()

  if (pending !== wasPending) {
    setWasPending(pending)
    if (!pending) setDismissed(false)
  }

  return {
    error: dismissed || pending ? undefined : error,
    dismiss: () => setDismissed(true),
  }
}
