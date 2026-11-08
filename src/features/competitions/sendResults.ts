import { competitionsApi } from '@/api/client'
import { apiErrorKind } from '@/shared/lib/apiError'
import { getEntry, listEntries, updateEntry } from './entryStore'
import { applyServerStatus, toResults } from './results'

export type SendOutcome =
  | 'sent'
  // The server already had newer results; the phone now shows them.
  | 'replaced'
  // Kept pending: retried when the connection is back or the app opens.
  | 'offline'
  // Kept pending: retried after RATE_LIMIT_RETRY_MS.
  | 'tooManyRequests'
  | 'closed'
  | 'notRegistered'
  | 'failed'

// The server allows a few sends per user every 15 seconds.
const RATE_LIMIT_RETRY_MS = 15_000

const inFlight = new Set<string>()

// Sends the phone's full results of one competition. The entry stays 'pending' until the server stores
// them, so a failed send is retried later (retryPending).
export async function sendResults(userId: number, competitionId: number): Promise<SendOutcome> {
  const entry = getEntry(userId, competitionId)
  if (!entry || entry.snapshot === 0) return 'failed'
  updateEntry(userId, competitionId, (current) => current && { ...current, send: 'pending' })

  const key = `${userId}.${competitionId}`
  if (inFlight.has(key)) return 'offline'
  inFlight.add(key)
  try {
    const status = await competitionsApi.submitCompetitionResults({
      competitionId,
      submitCompetitionResultsRequest: { snapshot: entry.snapshot, results: toResults(entry) },
    })
    updateEntry(
      userId,
      competitionId,
      (current) => current && { ...applyServerStatus(current, status), send: 'idle' },
    )
    return status.accepted === false ? 'replaced' : 'sent'
  } catch (error) {
    const kind = apiErrorKind(error)
    if (kind === 'network') return 'offline'
    if (kind === 'tooManyRequests') {
      setTimeout(() => void retryPending(userId), RATE_LIMIT_RETRY_MS)
      return 'tooManyRequests'
    }
    const send = kind === 'conflict' ? 'closed' : 'idle'
    updateEntry(userId, competitionId, (current) => current && { ...current, send })
    if (kind === 'conflict') return 'closed'
    if (kind === 'forbidden') return 'notRegistered'
    return 'failed'
  } finally {
    inFlight.delete(key)
  }
}

// Sends every competition whose results are waiting to reach the server.
export async function retryPending(userId: number): Promise<void> {
  const pending = listEntries(userId).filter((entry) => entry.send === 'pending')
  await Promise.all(pending.map((entry) => sendResults(userId, entry.competition.id)))
}
