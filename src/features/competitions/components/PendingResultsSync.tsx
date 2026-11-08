import { useEffect } from 'react'
import { retryPending } from '../sendResults'

// Retries results that couldn't be sent: when the app opens and every time the connection comes back.
export function PendingResultsSync({ userId }: { userId: number }) {
  useEffect(() => {
    void retryPending(userId)
    const onOnline = () => void retryPending(userId)
    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
  }, [userId])

  return null
}
