import type { CompetitionRankingEntryDto, CompetitionSection, Gender } from '@api'

// One ranking row: what the server sent plus its position after filtering.
export type RankingRow = CompetitionRankingEntryDto & { rank: number }

// '' means "all" in the two filters.
export type RankingFilter = { gender: Gender | ''; section: CompetitionSection | '' }

export const ALL = ''

function byRankingRules(a: CompetitionRankingEntryDto, b: CompetitionRankingEntryDto): number {
  // More points first; then more first-try tops; then fewer total attempts.
  return (
    b.totalPoints - a.totalPoints || b.flashTops - a.flashTops || a.totalAttempts - b.totalAttempts
  )
}

function tied(a: CompetitionRankingEntryDto, b: CompetitionRankingEntryDto): boolean {
  return (
    a.totalPoints === b.totalPoints &&
    a.flashTops === b.flashTops &&
    a.totalAttempts === b.totalAttempts
  )
}

// Filters the rows and ranks them by the competition rules. The rank is that of the row's group, so
// tied rows share a consecutive position (1, 1, 2 — not 1, 1, 3) and the rank always matches the filter.
export function computeRanking(
  entries: CompetitionRankingEntryDto[],
  filter: RankingFilter,
): RankingRow[] {
  const sorted = entries
    .filter(
      (entry) =>
        (filter.gender === ALL || entry.gender === filter.gender) &&
        (filter.section === ALL || entry.section === filter.section),
    )
    .sort(byRankingRules)

  let rank = 0
  return sorted.map((row, index) => {
    const previous = index > 0 ? sorted[index - 1] : undefined
    if (!previous || !tied(previous, row)) rank += 1
    return { ...row, rank }
  })
}
