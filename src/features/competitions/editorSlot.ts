import type { ReactNode } from 'react'
import type { CompetitionBoulderDto } from '@api'

// The hold editor lives in another feature: the route passes it in as this slot.
export type CompetitionBoulderEditorProps = {
  open: boolean
  onClose: () => void
  competitionId: number
  wallImageId: number
  // All or Nothing: each boulder has its own points value.
  withPoints: boolean
  // Editing this boulder; creating a new one when missing.
  boulder?: CompetitionBoulderDto
}

export type RenderCompetitionBoulderEditor = (props: CompetitionBoulderEditorProps) => ReactNode
