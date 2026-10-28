import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ErrorState } from '@/shared/ui/ErrorState'

export default function NotFound() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <ErrorState
      title={t('error.notFoundTitle')}
      message={t('error.notFoundMessage')}
      action={{ label: t('error.goHome'), onClick: () => void navigate('/gyms') }}
    />
  )
}
