import { useTranslation } from 'react-i18next'

export default function Gyms() {
  const { t } = useTranslation()
  return <h1 className="p-5 font-display text-4xl font-extrabold uppercase">{t('routes.gyms')}</h1>
}
