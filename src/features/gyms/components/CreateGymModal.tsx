import { useActionState, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useCreateGym } from '@/api/queries/useCreateGym'
import { deviceTimeZone, ianaTimeZones } from '@/shared/lib/timezone'
import { Button } from '@/shared/ui/Button'
import { ModalHeader, ModalPanel } from '@/shared/ui/ModalPanel'
import { SelectField } from '@/shared/ui/SelectField'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { TextField } from '@/shared/ui/TextField'
import {
  createGymErrorKey,
  initialCreateGymState,
  validateGymName,
  type CreateGymFormState,
} from '../actions'
import { LogoPicker } from './LogoPicker'

type CreateGymModalProps = { open: boolean; onClose: () => void }

export function CreateGymModal({ open, onClose }: CreateGymModalProps) {
  const { t } = useTranslation('gyms')

  return (
    <ModalPanel open={open} label={t('form.title')}>
      <ModalHeader title={t('form.title')} closeLabel={t('form.close')} onClose={onClose} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <CreateGymForm onCreated={onClose} />
      </div>
    </ModalPanel>
  )
}

function text(data: FormData, key: string): string {
  const value = data.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function CreateGymForm({ onCreated }: { onCreated: () => void }) {
  const { t } = useTranslation('gyms')
  const create = useCreateGym()
  const logo = useRef<string | null>(null)

  const timeZones = useMemo(() => {
    const zones = ianaTimeZones()
    const device = deviceTimeZone()
    return zones.includes(device) ? zones : [device, ...zones]
  }, [])

  const submit = async (
    _previous: CreateGymFormState,
    data: FormData,
  ): Promise<CreateGymFormState> => {
    const name = text(data, 'name')
    const location = text(data, 'location')
    const description = text(data, 'description')
    const timeZone = text(data, 'timeZone') || deviceTimeZone()
    const values = { name, location, description, timeZone }

    const nameError = validateGymName(name)
    if (nameError) return { ok: false, fieldErrors: { name: nameError }, values }

    try {
      await create.mutateAsync({
        name,
        timeZone,
        ...(location ? { location } : {}),
        ...(description ? { description } : {}),
        ...(logo.current ? { logo: logo.current } : {}),
      })
      onCreated()
      return { ok: true, fieldErrors: {}, values }
    } catch (error) {
      return { ok: false, fieldErrors: {}, formError: createGymErrorKey(error), values }
    }
  }

  const [state, action, pending] = useActionState(submit, initialCreateGymState)

  return (
    <form action={action} noValidate className="grid gap-4 px-5 pt-4 pb-8">
      {state.formError ? (
        <p role="alert" className="border-2 border-error bg-surface p-3 font-semibold">
          {t(state.formError)}
        </p>
      ) : null}
      <TextField
        name="name"
        autoComplete="off"
        label={t('form.name')}
        defaultValue={state.values.name}
        error={state.fieldErrors.name ? t(state.fieldErrors.name) : undefined}
      />
      <SelectField name="timeZone" label={t('form.timeZone')} defaultValue={state.values.timeZone}>
        {timeZones.map((zone) => (
          <option key={zone} value={zone}>
            {zone}
          </option>
        ))}
      </SelectField>
      <TextField
        name="location"
        autoComplete="off"
        label={t('form.location')}
        defaultValue={state.values.location}
      />
      <TextAreaField
        name="description"
        label={t('form.description')}
        defaultValue={state.values.description}
      />
      <LogoPicker
        onChange={(base64) => {
          logo.current = base64
        }}
      />
      <Button type="submit" variant="primary" loading={pending} className="mt-2">
        {t('form.submit')}
      </Button>
    </form>
  )
}
