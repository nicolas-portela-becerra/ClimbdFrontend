import { useSyncExternalStore } from 'react'
import { storage } from '@/shared/lib/storage'
import type { CompetitionEntry } from './results'

// One localStorage key per user and competition, so another account on the same phone never sees it.
const PREFIX = 'climbd.competition.'
// How long a competition's data stays on the phone after it ends.
export const KEEP_AFTER_END_MS = 7 * 24 * 60 * 60_000

const keyOf = (userId: number, competitionId: number) => `${PREFIX}${userId}.${competitionId}`

const listeners = new Set<() => void>()
// Parsed entries, so every read returns the same object until it changes (useSyncExternalStore).
const cache = new Map<string, CompetitionEntry | undefined>()

function read(key: string): CompetitionEntry | undefined {
  if (cache.has(key)) return cache.get(key)
  let entry: CompetitionEntry | undefined
  try {
    const raw = storage.get(key)
    entry = raw ? (JSON.parse(raw) as CompetitionEntry) : undefined
  } catch {
    entry = undefined
  }
  cache.set(key, entry)
  return entry
}

function notify() {
  for (const listener of listeners) listener()
}

export function getEntry(userId: number, competitionId: number): CompetitionEntry | undefined {
  return read(keyOf(userId, competitionId))
}

export function updateEntry(
  userId: number,
  competitionId: number,
  update: (current: CompetitionEntry | undefined) => CompetitionEntry | undefined,
): CompetitionEntry | undefined {
  const key = keyOf(userId, competitionId)
  const current = read(key)
  const next = update(current)
  if (next === current) return current
  cache.set(key, next)
  if (next) storage.set(key, JSON.stringify(next))
  else storage.remove(key)
  notify()
  return next
}

// Every competition the phone has data for, for one user. Removes the ones that ended long ago.
export function listEntries(userId: number): CompetitionEntry[] {
  const prefix = `${PREFIX}${userId}.`
  const keys: string[] = []
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(prefix)) keys.push(key)
    }
  } catch {
    return []
  }
  const now = Date.now()
  return keys.flatMap((key) => {
    const entry = read(key)
    if (!entry) return []
    if (now - Date.parse(entry.competition.dateTo) > KEEP_AFTER_END_MS) {
      storage.remove(key)
      cache.delete(key)
      return []
    }
    return [entry]
  })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  // Another tab changed the data.
  const onStorage = (event: StorageEvent) => {
    if (event.key?.startsWith(PREFIX)) {
      cache.delete(event.key)
      listener()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useEntry(userId: number, competitionId: number): CompetitionEntry | undefined {
  return useSyncExternalStore(subscribe, () => getEntry(userId, competitionId))
}

// Re-renders when any entry changes; the caller reads what it needs (e.g. listEntries).
let version = 0
listeners.add(() => {
  version += 1
})
export function useEntriesVersion(): number {
  return useSyncExternalStore(subscribe, () => version)
}
