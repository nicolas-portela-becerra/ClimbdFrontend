import { useActionState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/Button'
import { TextField } from '@/shared/ui/TextField'
import { initialAuthFormState, loginAction } from '../actions'

export function LoginForm() {
  const { t } = useTranslation('auth')
  const [state, action, pending] = useActionState(loginAction, initialAuthFormState)

  return (
    <form action={action} noValidate className="grid gap-3">
      {state.formError ? (
        <p role="alert" className="border-2 border-error bg-surface p-3 font-semibold">
          {t(state.formError)}
        </p>
      ) : null}
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
        autoComplete="current-password"
        label={t('fields.password')}
        error={state.fieldErrors.password ? t(state.fieldErrors.password) : undefined}
      />
      <Button type="submit" variant="primary" loading={pending} className="mt-2">
        {t('login.submit')}
      </Button>
    </form>
  )
}
