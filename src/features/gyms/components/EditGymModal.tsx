import { useActionState, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { GymDto } from '@api'
import { useGym } from '@/api/queries/useGym'
import { useUpdateGym } from '@/api/queries/useUpdateGym'
import { deviceTimeZone, ianaTimeZones } from '@/shared/lib/timezone'
import { Button } from '@/shared/ui/Button'
import { ErrorState } from '@/shared/ui/ErrorState'
import { ModalHeader, ModalPanel } from '@/shared/ui/ModalPanel'
import { SelectField } from '@/shared/ui/SelectField'
import { Spinner } from '@/shared/ui/Spinner'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { TextField } from '@/shared/ui/TextField'
import { editGymErrorKey, validateGymName, type CreateGymFormState } from '../actions'
import { GymLogo } from './GymLogo'
import { LogoPicker } from './LogoPicker'

type EditGymModalProps = { open: boolean; onClose: () => void; gymId: number }

// Change the gym's name, location, description, time zone and (optionally) logo. Owner or admin.
export function EditGymModal({ open, onClose, gymId }: EditGymModalProps) {
  const { t } = useTranslation('gyms')

  return (
    <ModalPanel open={open} label={t('edit.title')}>
      <ModalHeader title={t('edit.title')} closeLabel={t('edit.close')} onClose={onClose} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <EditGymContent gymId={gymId} onSaved={onClose} />
      </div>
    </ModalPanel>
  )
}

function EditGymContent({ gymId, onSaved }: { gymId: number; onSaved: () => void }) {
  const { t } = useTranslation(['gyms', 'common'])
  const gym = useGym(gymId)

  if (gym.isPending) {
    return (
      <div className="grid place-items-center py-16">
        <Spinner />
      </div>
    )
  }
  if (gym.isError || !gym.data) {
    return (
      <ErrorState
        title={t('common:error.title')}
        message={t('common:error.message')}
        action={{ label: t('common:error.retry'), onClick: () => void gym.refetch() }}
      />
    )
  }

  return <EditGymForm gym={gym.data} onSaved={onSaved} />
}

function text(data: FormData, key: string): string {
  const value = data.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

const logoSrc = (logo: string) => `data:image/jpeg;base64,${logo}`

function EditGymForm({ gym, onSaved }: { gym: GymDto; onSaved: () => void }) {
  const { t } = useTranslation('gyms')
  const update = useUpdateGym(gym.id ?? 0)
  const logo = useRef<string | null>(null)

  const timeZones = useMemo(() => {
    const zones = ianaTimeZones()
    const device = deviceTimeZone()
    return zones.includes(device) ? zones : [device, ...zones]
  }, [])

  const initial: CreateGymFormState = {
    ok: false,
    fieldErrors: {},
    values: {
      name: gym.name ?? '',
      location: gym.location ?? '',
      description: gym.description ?? '',
      timeZone: gym.timeZone ?? deviceTimeZone(),
    },
  }

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
      await update.mutateAsync({
        name,
        timeZone,
        location,
        description,
        ...(logo.current ? { logo: logo.current } : {}),
      })
      onSaved()
      return { ok: true, fieldErrors: {}, values }
    } catch (error) {
      return { ok: false, fieldErrors: {}, formError: editGymErrorKey(error), values }
    }
  }

  const [state, action, pending] = useActionState(submit, initial)

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
        label={t('edit.name')}
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
      <div className="grid gap-2">
        <span className="font-cond text-sm font-semibold tracking-wide uppercase">
          {t('form.logo')}
        </span>
        {gym.logo ? (
          <div className="flex items-center gap-3">
            <GymLogo src={logoSrc(gym.logo)} />
            <span className="text-sm text-muted">{t('edit.logoKept')}</span>
          </div>
        ) : null}
        <LogoPicker
          onChange={(base64) => {
            logo.current = base64
          }}
        />
      </div>
      <Button type="submit" variant="primary" loading={pending} className="mt-2">
        {t('edit.submit')}
      </Button>
    </form>
  )
}
