import type { BoulderResultRequest, CompetitionBoulderDto, CompetitionUserStatusDto } from '@api'

// What the user logged on one boulder.
export type BoulderLog = { attempts: number; topped: boolean }

// The competition's basic data, kept so its row and screen still work after the server stops listing it.
export type SavedCompetition = {
  id: number
  gymId: number
  name: string
  type: string
  dateFrom: string
  dateTo: string
}

export type SendState =
  // Nothing to retry.
  | 'idle'
  // The user pressed "Send" and the latest snapshot hasn't reached the server yet.
  | 'pending'
  // The server stopped accepting results.
  | 'closed'

// Everything the phone keeps for one user in one competition (localStorage, JSON).
export type CompetitionEntry = {
  competition: SavedCompetition
  logs: Record<string, BoulderLog>
  // Version of `logs`: goes up on every change and is sent as the snapshot number.
  snapshot: number
  send: SendState
  // The last snapshot the server stored, with when and the points it gave.
  sent?: { snapshot: number; at: string; totalPoints: number }
  resultsOpenUntil?: string
  // Copy of the boulders, so the list can still be read offline and after the server stops sending them.
  boulders?: CompetitionBoulderDto[]
}

export function emptyEntry(competition: SavedCompetition): CompetitionEntry {
  return { competition, logs: {}, snapshot: 0, send: 'idle' }
}

export function logOf(entry: CompetitionEntry | undefined, boulderId: number): BoulderLog {
  return entry?.logs[boulderId] ?? { attempts: 0, topped: false }
}

function withLog(entry: CompetitionEntry, boulderId: number, log: BoulderLog): CompetitionEntry {
  return { ...entry, logs: { ...entry.logs, [boulderId]: log }, snapshot: entry.snapshot + 1 }
}

// A topped boulder is locked: its attempts can't change until the top is removed.
export function addAttempt(entry: CompetitionEntry, boulderId: number): CompetitionEntry {
  const log = logOf(entry, boulderId)
  if (log.topped) return entry
  return withLog(entry, boulderId, { ...log, attempts: log.attempts + 1 })
}

export function removeAttempt(entry: CompetitionEntry, boulderId: number): CompetitionEntry {
  const log = logOf(entry, boulderId)
  if (log.topped || log.attempts === 0) return entry
  return withLog(entry, boulderId, { ...log, attempts: log.attempts - 1 })
}

// A top needs at least one attempt: topping with none counts as a flash (1 attempt).
export function toggleTop(entry: CompetitionEntry, boulderId: number): CompetitionEntry {
  const log = logOf(entry, boulderId)
  return withLog(
    entry,
    boulderId,
    log.topped ? { ...log, topped: false } : { attempts: Math.max(1, log.attempts), topped: true },
  )
}

// Every boulder the user has tried (0 attempts = not tried, not sent).
export function toResults(entry: CompetitionEntry): BoulderResultRequest[] {
  return Object.entries(entry.logs)
    .filter(([, log]) => log.attempts > 0)
    .map(([boulderId, log]) => ({
      boulderId: Number(boulderId),
      attempts: log.attempts,
      topped: log.topped,
    }))
}

// True when there are changes the server hasn't stored.
export function hasUnsent(entry: CompetitionEntry | undefined): boolean {
  return !!entry && entry.snapshot > (entry.sent?.snapshot ?? 0)
}

// Applies what the server has stored. When it is newer than the phone's copy (e.g. the app's data was
// cleared), the server's results replace the phone's.
export function applyServerStatus(
  entry: CompetitionEntry,
  status: CompetitionUserStatusDto,
): CompetitionEntry {
  const stored = status.lastSnapshot ?? 0
  const next: CompetitionEntry = {
    ...entry,
    ...(status.resultsOpenUntil ? { resultsOpenUntil: status.resultsOpenUntil.toISOString() } : {}),
  }
  if (stored > 0) {
    next.sent = {
      snapshot: stored,
      at: entry.sent?.snapshot === stored ? entry.sent.at : new Date().toISOString(),
      totalPoints: status.totalPoints ?? 0,
    }
  }
  if (stored > entry.snapshot) {
    next.snapshot = stored
    next.logs = Object.fromEntries(
      (status.results ?? []).flatMap((result) =>
        result.boulderId === undefined
          ? []
          : [
              [
                String(result.boulderId),
                { attempts: result.attempts ?? 0, topped: result.topped ?? false },
              ],
            ],
      ),
    )
  }
  return next
}
