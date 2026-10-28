import { useActionState, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { TextField } from '@/shared/ui/TextField'
import { initialAuthFormState, loginAction } from '../actions'

const NOTICE_MS = 5000

type LoginFormProps = {
  // Message shown above the form (account created, session expired).
  notice?: { text: string; tone: 'success' | 'info' } | undefined
}

export function LoginForm({ notice }: LoginFormProps) {
  const { t } = useTranslation('auth')
  const [state, action, pending] = useActionState(loginAction, initialAuthFormState)
  const [noticeHidden, setNoticeHidden] = useState(false)

  // The notice goes away after 5 s or as soon as the user presses Log in.
  useEffect(() => {
    if (!notice) return
    const id = setTimeout(() => setNoticeHidden(true), NOTICE_MS)
    return () => clearTimeout(id)
  }, [notice])

  return (
    <form action={action} onSubmit={() => setNoticeHidden(true)} noValidate className="grid gap-3">
      {/* One message at a time: a login error replaces the notice. */}
      {state.formError ? (
        <p role="alert" className="border-2 border-error bg-surface p-3 font-semibold">
          {t(state.formError)}
        </p>
      ) : notice && !noticeHidden ? (
        <p
          role="status"
          className={cn(
            'border-2 p-3 font-semibold',
            notice.tone === 'success' ? 'border-accent bg-accent-field' : 'border-ink bg-surface',
          )}
        >
          {notice.text}
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
