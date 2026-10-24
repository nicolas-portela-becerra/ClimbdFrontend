import { useActionState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/Button'
import { TextField } from '@/shared/ui/TextField'
import { initialAuthFormState, registerAction } from '../actions'

export function RegisterForm({ onRegistered }: { onRegistered: () => void }) {
  const { t } = useTranslation('auth')
  const [state, action, pending] = useActionState(registerAction, initialAuthFormState)

  useEffect(() => {
    if (state.ok) onRegistered()
  }, [state.ok, onRegistered])

  return (
    <form action={action} noValidate className="grid gap-3">
      {state.formError ? (
        <p role="alert" className="border-2 border-error bg-surface p-3 font-semibold">
          {t(state.formError)}
        </p>
      ) : null}
      <TextField
        name="name"
        autoComplete="name"
        label={t('fields.name')}
        defaultValue={state.values.name}
        error={state.fieldErrors.name ? t(state.fieldErrors.name) : undefined}
      />
      <TextField
        name="email"
        type="email"
        autoComplete="email"
        label={t('fields.email')}
        defaultValue={state.values.email}
        error={state.fieldErrors.email ? t(state.fieldErrors.email) : undefined}
      />
      <TextField
        name="password"
        type="password"
        autoComplete="new-password"
        label={t('fields.password')}
        error={state.fieldErrors.password ? t(state.fieldErrors.password) : undefined}
      />
      <Button type="submit" variant="primary" loading={pending} className="mt-2">
        {t('register.submit')}
      </Button>
    </form>
  )
}
