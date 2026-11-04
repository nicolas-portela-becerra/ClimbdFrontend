import { useActionState, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CompetitionType, type CompetitionRequest } from '@api'
import { useCreateCompetition } from '@/api/queries/useCreateCompetition'
import { Button } from '@/shared/ui/Button'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { ModalHeader, ModalPanel } from '@/shared/ui/ModalPanel'
import { SelectField } from '@/shared/ui/SelectField'
import { TextField } from '@/shared/ui/TextField'
import {
  createErrorKey,
  emptyCompetitionValues,
  validateCompetition,
  type CompetitionField,
  type CompetitionFormValues,
} from '../actions'

type NewCompetitionModalProps = { open: boolean; onClose: () => void; gymId: number }

export function NewCompetitionModal({ open, onClose, gymId }: NewCompetitionModalProps) {
  const { t } = useTranslation('competitions')

  return (
    <ModalPanel open={open} label={t('create.title')}>
      <ModalHeader title={t('create.title')} closeLabel={t('create.close')} onClose={onClose} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <CompetitionForm gymId={gymId} onCreated={onClose} />
      </div>
    </ModalPanel>
  )
}

type FormState = {
  fieldErrors: Partial<
    Record<CompetitionField, ReturnType<typeof validateCompetition>['errors'][CompetitionField]>
  >
  values: CompetitionFormValues
  // Valid request waiting for the user to confirm (it can't be changed afterwards).
  toConfirm: CompetitionRequest | null
}

const FIELDS = Object.keys(emptyCompetitionValues) as (keyof CompetitionFormValues)[]

function CompetitionForm({ gymId, onCreated }: { gymId: number; onCreated: () => void }) {
  const { t } = useTranslation('competitions')
  const create = useCreateCompetition(gymId)
  const [type, setType] = useState<string>(emptyCompetitionValues.type)
  const [formError, setFormError] = useState<string | null>(null)

  const check = (_previous: FormState, data: FormData): FormState => {
    const values = Object.fromEntries(
      FIELDS.map((field) => {
        const value = data.get(field)
        return [field, typeof value === 'string' ? value : '']
      }),
    ) as CompetitionFormValues
    const { errors, request } = validateCompetition(values)
    setFormError(null)
    return { fieldErrors: errors, values, toConfirm: request }
  }

  const [state, action] = useActionState(check, {
    fieldErrors: {},
    values: emptyCompetitionValues,
    toConfirm: null,
  })
  const [dismissed, setDismissed] = useState<CompetitionRequest | null>(null)
  const confirming = state.toConfirm !== null && state.toConfirm !== dismissed

  const confirm = () => {
    if (!state.toConfirm) return
    const request = state.toConfirm
    create.mutate(request, {
      onSuccess: onCreated,
      onError: (error) => {
        setDismissed(request)
        setFormError(t(createErrorKey(error)))
      },
    })
  }

  const error = (field: CompetitionField) => {
    const key = state.fieldErrors[field]
    return key ? t(key) : undefined
  }
  const xAttempts = type === CompetitionType.XAttempts

  return (
    <form action={action} noValidate className="grid gap-3 px-5 pt-4 pb-8">
      {formError ? (
        <p role="alert" className="border-2 border-error bg-surface p-3 font-semibold">
          {formError}
        </p>
      ) : null}
      <TextField
        name="name"
        autoComplete="off"
        label={t('create.name')}
        defaultValue={state.values.name}
        error={error('name')}
      />
      <SelectField
        // React resets the form after a submit; remounting restores the chosen type.
        key={state.values.type}
        name="type"
        label={t('create.type')}
        defaultValue={state.values.type}
        onChange={(event) => setType(event.target.value)}
      >
        <option value={CompetitionType.AllOrNothing}>{t('type.ALL_OR_NOTHING')}</option>
        <option value={CompetitionType.XAttempts}>{t('type.X_ATTEMPTS')}</option>
      </SelectField>
      <p className="text-sm text-muted">
        {t(`create.typeHint.${xAttempts ? 'X_ATTEMPTS' : 'ALL_OR_NOTHING'}`)}
      </p>
      <TextField
        name="dateFrom"
        type="datetime-local"
        label={t('create.dateFrom')}
        defaultValue={state.values.dateFrom}
        error={error('dateFrom')}
      />
      <TextField
        name="dateTo"
        type="datetime-local"
        label={t('create.dateTo')}
        defaultValue={state.values.dateTo}
        error={error('dateTo')}
      />
      <TextField
        name="graceMinutes"
        inputMode="numeric"
        label={t('create.graceMinutes')}
        defaultValue={state.values.graceMinutes}
        error={error('graceMinutes')}
      />
      {xAttempts ? (
        <>
          <TextField
            name="basePoints"
            inputMode="numeric"
            label={t('create.basePoints')}
            defaultValue={state.values.basePoints}
            error={error('basePoints')}
          />
          <TextField
            name="attemptPenalty"
            inputMode="numeric"
            label={t('create.attemptPenalty')}
            defaultValue={state.values.attemptPenalty}
            error={error('attemptPenalty')}
          />
          <TextField
            name="minPoints"
            inputMode="numeric"
            label={t('create.minPoints')}
            defaultValue={state.values.minPoints}
            error={error('minPoints')}
          />
        </>
      ) : null}
      <Button type="submit" variant="primary" className="mt-2">
        {t('create.submit')}
      </Button>

      <ConfirmDialog
        open={confirming}
        title={t('create.confirmTitle')}
        message={t('create.confirmMessage')}
        cancelLabel={t('create.confirmCancel')}
        confirmLabel={t('create.confirmOk')}
        loading={create.isPending}
        onCancel={() => setDismissed(state.toConfirm)}
        onConfirm={confirm}
        destructive={false}
      />
    </form>
  )
}
