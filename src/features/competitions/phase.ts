import type { CompetitionEntry, SavedCompetition } from './results'

export type Phase = 'upcoming' | 'running' | 'grace' | 'ended'

// Used until the server reports the real end of the results window (resultsOpenUntil).
const DEFAULT_GRACE_MS = 5 * 60_000

export function resultsOpenUntil(
  competition: SavedCompetition,
  entry: CompetitionEntry | undefined,
): number {
  return entry?.resultsOpenUntil
    ? Date.parse(entry.resultsOpenUntil)
    : Date.parse(competition.dateTo) + DEFAULT_GRACE_MS
}

// Where the competition is in time, by the phone's clock (the server makes the final decision).
export function phaseOf(
  competition: SavedCompetition,
  entry: CompetitionEntry | undefined,
  now = Date.now(),
): Phase {
  if (now < Date.parse(competition.dateFrom)) return 'upcoming'
  if (now < Date.parse(competition.dateTo)) return 'running'
  if (now < resultsOpenUntil(competition, entry) && entry?.send !== 'closed') return 'grace'
  return 'ended'
}

export function formatDateTime(iso: string, language: string): string {
  return new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(iso),
  )
}
