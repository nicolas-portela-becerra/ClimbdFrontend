import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/Button'

// Under "Send results", over the boulders list, once the competition's results window is closed.
export function CheckResultsButton({
  gymId,
  competitionId,
}: {
  gymId: number
  competitionId: number
}) {
  const { t } = useTranslation('competitions')
  const navigate = useNavigate()

  return (
    <Button
      variant="primary"
      onClick={() => navigate(`/gyms/${gymId}/competitions/${competitionId}/ranking`)}
    >
      {t('checkResults')}
    </Button>
  )
}
