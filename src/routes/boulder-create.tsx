import { useTranslation } from 'react-i18next'

export default function BoulderCreate() {
  const { t } = useTranslation()
  return (
    <h1 className="p-5 font-display text-4xl font-extrabold uppercase">
      {t('routes.boulderCreate')}
    </h1>
  )
}
