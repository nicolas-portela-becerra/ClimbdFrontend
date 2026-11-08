import { describe, expect, it } from 'vitest'
import { CompetitionSection, type CompetitionRankingEntryDto, type Gender } from '@api'
import { computeRanking } from './ranking'

const row = (
  name: string,
  totalPoints: number,
  flashTops: number,
  totalAttempts: number,
  gender: Gender = 'MAN',
  section: CompetitionSection = 'OPEN',
): CompetitionRankingEntryDto => ({ name, totalPoints, flashTops, totalAttempts, gender, section })

describe('computeRanking', () => {
  it('sorts by points, then flash tops, then attempts, with consecutive shared ranks', () => {
    const rows = computeRanking(
      [
        row('C', 10, 1, 20),
        row('A', 30, 2, 15),
        row('B', 30, 2, 15),
        row('E', 20, 3, 10),
        row('D', 30, 3, 30),
      ],
      { gender: '', section: '' },
    )
    expect(rows.map((r) => [r.name, r.rank])).toEqual([
      ['D', 1],
      ['A', 2],
      ['B', 2],
      ['E', 3],
      ['C', 4],
    ])
  })

  it('recomputes the rank for each filter', () => {
    const entries = [
      row('A', 30, 2, 15, 'MAN', 'OPEN'),
      row('B', 20, 1, 10, 'WOMAN', 'OPEN'),
      row('C', 40, 3, 5, 'MAN', 'AMATEUR'),
      row('D', 25, 2, 8, 'WOMAN', 'AMATEUR'),
    ]
    expect(
      computeRanking(entries, { gender: 'MAN', section: 'OPEN' }).map((r) => [r.name, r.rank]),
    ).toEqual([['A', 1]])
    expect(computeRanking(entries, { gender: 'WOMAN', section: '' }).map((r) => r.name)).toEqual([
      'D',
      'B',
    ])
  })
})
