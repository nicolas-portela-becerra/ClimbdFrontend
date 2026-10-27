import { useActionState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCreateBoulder } from '@/api/queries/useCreateBoulder'
import { GRADES } from '@/shared/lib/grades'
import { Button } from '@/shared/ui/Button'
import { SelectField } from '@/shared/ui/SelectField'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { TextField } from '@/shared/ui/TextField'
import {
  initialDetailsState,
  saveErrorKey,
  validateDetails,
  type DetailsFormState,
} from '../actions'
import type { EditorHold } from '../useHoldEditor'

type DetailsFormProps = {
  gymId: number
  wallImageId: number
  userId: number
  holds: EditorHold[]
  onCreated: () => void
}

function text(data: FormData, key: string): string {
  const value = data.get(key)
  return typeof value === 'string' ? value : ''
}

export function DetailsForm({ gymId, wallImageId, userId, holds, onCreated }: DetailsFormProps) {
  const { t } = useTranslation('editor')
  const create = useCreateBoulder(gymId)

  const submit = async (_previous: DetailsFormState, data: FormData): Promise<DetailsFormState> => {
    const name = text(data, 'name').trim()
    const grade = text(data, 'grade')
    const description = text(data, 'description').trim()
    const values = { name, grade, description }

    const fieldErrors = validateDetails({ name, grade })
    if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors, values }

    try {
      await create.mutateAsync({
        name,
        grade,
        wallImageId,
        createdBy: userId,
        holds: holds.map((hold) => ({
          xRatio: hold.x,
          yRatio: hold.y,
          radiusRatio: hold.r,
          color: hold.role,
        })),
        ...(description ? { description } : {}),
      })
      onCreated()
      return { ok: true, fieldErrors: {}, values }
    } catch (error) {
      return { ok: false, fieldErrors: {}, formError: saveErrorKey(error), values }
    }
  }

  const [state, action, pending] = useActionState(submit, initialDetailsState)

  return (
    <form action={action} noValidate className="grid gap-3 px-5 pt-4 pb-8">
      {state.formError ? (
        <p role="alert" className="border-2 border-error bg-surface p-3 font-semibold">
          {t(state.formError)}
        </p>
      ) : null}
      <TextField
        name="name"
        autoComplete="off"
        label={t('details.name')}
        defaultValue={state.values.name}
        error={state.fieldErrors.name ? t(state.fieldErrors.name) : undefined}
      />
      <SelectField
        // React resets a <select> to its first option after a submit; remounting restores the chosen grade.
        key={state.values.grade}
        name="grade"
        label={t('details.grade')}
        defaultValue={state.values.grade}
        error={state.fieldErrors.grade ? t(state.fieldErrors.grade) : undefined}
      >
        <option value="">{t('details.gradePlaceholder')}</option>
        {GRADES.map((grade) => (
          <option key={grade} value={grade}>
            {grade}
          </option>
        ))}
      </SelectField>
      <TextAreaField
        name="description"
        label={t('details.description')}
        defaultValue={state.values.description}
      />
      <Button type="submit" variant="primary" loading={pending} className="mt-2">
        {t('details.submit')}
      </Button>
    </form>
  )
}
