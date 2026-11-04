import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CompetitionBoulderDto } from '@api'
import { useDeleteCompetitionBoulder } from '@/api/queries/useCompetitionBoulderMutations'
import { useToast } from '@/shared/hooks/useToast'
import { apiErrorKind } from '@/shared/lib/apiError'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { DropdownMenu } from '@/shared/ui/DropdownMenu'

type Props = {
  boulder: CompetitionBoulderDto
  competitionId: number
  onEdit: () => void
}

// Organiser menu of a competition boulder (before the start): edit or delete it.
export function CompetitionBoulderMenu({ boulder, competitionId, onEdit }: Props) {
  const { t } = useTranslation('competitions')
  const { showError } = useToast()
  const remove = useDeleteCompetitionBoulder(competitionId)
  const [confirming, setConfirming] = useState(false)

  if (boulder.id === undefined) return null
  const boulderId = boulder.id

  return (
    <>
      <DropdownMenu
        label={t('organiser.menu')}
        items={[
          { label: t('organiser.edit'), onSelect: onEdit },
          { label: t('organiser.delete'), onSelect: () => setConfirming(true), destructive: true },
        ]}
      />
      <ConfirmDialog
        open={confirming}
        title={t('organiser.deleteTitle')}
        message={t('organiser.deleteMessage', { name: boulder.name ?? '' })}
        cancelLabel={t('organiser.deleteCancel')}
        confirmLabel={t('organiser.deleteConfirm')}
        loading={remove.isPending}
        onCancel={() => setConfirming(false)}
        onConfirm={() =>
          remove.mutate(boulderId, {
            onSettled: () => setConfirming(false),
            onError: (error) =>
              showError(
                apiErrorKind(error) === 'forbidden'
                  ? t('errors.forbidden')
                  : t('organiser.deleteFailed'),
              ),
          })
        }
      />
    </>
  )
}
