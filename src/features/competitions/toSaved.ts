import type { CompetitionAnnouncementDto } from '@api'
import type { SavedCompetition } from './results'

export function toSaved(
  announcement: CompetitionAnnouncementDto,
  gymId: number,
): SavedCompetition | null {
  const { id, name, type, dateFrom, dateTo } = announcement
  if (id === undefined || !dateFrom || !dateTo) return null
  return {
    id,
    gymId,
    name: name ?? '',
    type: type ?? '',
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString(),
  }
}
