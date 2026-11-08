import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CompetitionSection } from '@api'
import {
  useRegisterForCompetition,
  useUnregisterFromCompetition,
} from '@/api/queries/useCompetitionRegistration'
import { useToast } from '@/shared/hooks/useToast'
import { apiErrorKind } from '@/shared/lib/apiError'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { updateEntry } from '../entryStore'

type RegistrationPanelProps = {
  gymId: number
  userId: number
  competitionId: number
  registered: boolean
  // The category the user registered in, when known.
  section: string | undefined
}

// Before the start: register choosing a category, or cancel the registration.
export function RegistrationPanel({
  gymId,
  userId,
  competitionId,
  registered,
  section,
}: RegistrationPanelProps) {
  const { t } = useTranslation('competitions')
  const { showError } = useToast()
  const register = useRegisterForCompetition(gymId, competitionId)
  const unregister = useUnregisterFromCompetition(gymId, competitionId)
  const [chosen, setChosen] = useState<CompetitionSection>(CompetitionSection.Open)
  const [confirming, setConfirming] = useState(false)

  const failed = (error: unknown) =>
    showError(apiErrorKind(error) === 'conflict' ? t('register.closed') : t('register.failed'))

  if (registered) {
    return (
      <section className="mx-5 mb-4 grid gap-3 border-2 border-ink bg-surface p-4">
        <p className="font-cond text-lg font-bold uppercase">
          {section
            ? t('register.registeredAs', { section: t(`section.${section as CompetitionSection}`) })
            : t('rows.registered')}
        </p>
        <Button onClick={() => setConfirming(true)}>{t('register.unregister')}</Button>
        <ConfirmDialog
          open={confirming}
          title={t('register.unregisterTitle')}
          message={t('register.unregisterMessage')}
          cancelLabel={t('register.unregisterCancel')}
          confirmLabel={t('register.unregisterConfirm')}
          loading={unregister.isPending}
          onCancel={() => setConfirming(false)}
          onConfirm={() =>
            unregister.mutate(undefined, {
              onSettled: () => setConfirming(false),
              // Nothing was logged before the start: the phone's copy can go.
              onSuccess: () => updateEntry(userId, competitionId, () => undefined),
              onError: failed,
            })
          }
        />
      </section>
    )
  }

  return (
    <section
      aria-labelledby="registration-title"
      className="mx-5 mb-4 grid gap-3 border-2 border-ink bg-surface p-4"
    >
      <h2 id="registration-title" className="font-cond text-lg font-bold uppercase">
        {t('register.title')}
      </h2>
      <fieldset className="grid gap-2">
        <legend className="mb-2 font-cond text-sm font-semibold tracking-wide uppercase">
          {t('register.section')}
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(CompetitionSection).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={value === chosen}
              onClick={() => setChosen(value)}
              className={cn(
                'min-h-12 border-2 font-cond text-lg font-bold uppercase',
                value === chosen
                  ? 'border-ink bg-raised shadow-[inset_0_-4px_0_var(--ink)]'
                  : 'border-line bg-ground',
              )}
            >
              {t(`section.${value}`)}
            </button>
          ))}
        </div>
      </fieldset>
      <Button
        variant="primary"
        loading={register.isPending}
        onClick={() => register.mutate(chosen, { onError: failed })}
      >
        {t('register.submit')}
      </Button>
    </section>
  )
}
