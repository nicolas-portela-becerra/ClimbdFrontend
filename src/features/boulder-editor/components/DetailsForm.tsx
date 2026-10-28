import { useActionState } from 'react'
import { useTranslation } from 'react-i18next'
import { ResponseError } from '@api'
import { GRADES } from '@/shared/lib/grades'
import { Button } from '@/shared/ui/Button'
import { SelectField } from '@/shared/ui/SelectField'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { TextField } from '@/shared/ui/TextField'
import {
  saveErrorKey,
  validateDetails,
  type BoulderDetails,
  type DetailsFormState,
} from '../actions'

type DetailsFormProps = {
  initialValues: BoulderDetails
  submitLabel: string
  // Saves the boulder; throws when the server refuses.
  onSubmit: (details: BoulderDetails) => Promise<void>
  // Called instead of showing an inline error when the server answers 403 (not allowed).
  onForbidden?: () => void
}

function text(data: FormData, key: string): string {
  const value = data.get(key)
  return typeof value === 'string' ? value : ''
}

export function DetailsForm({
  initialValues,
  submitLabel,
  onSubmit,
  onForbidden,
}: DetailsFormProps) {
  const { t } = useTranslation('editor')

  const submit = async (_previous: DetailsFormState, data: FormData): Promise<DetailsFormState> => {
    const name = text(data, 'name').trim()
    const grade = text(data, 'grade')
    const description = text(data, 'description').trim()
    const values = { name, grade, description }

    const fieldErrors = validateDetails({ name, grade })
    if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors, values }

    try {
      await onSubmit(values)
      return { ok: true, fieldErrors: {}, values }
    } catch (error) {
      if (onForbidden && error instanceof ResponseError && error.response.status === 403) {
        onForbidden()
        return { ok: false, fieldErrors: {}, values }
      }
      return { ok: false, fieldErrors: {}, formError: saveErrorKey(error), values }
    }
  }

  const [state, action, pending] = useActionState(submit, {
    ok: false,
    fieldErrors: {},
    values: initialValues,
  })

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
        {submitLabel}
      </Button>
    </form>
  )
}
