import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/shared/hooks/useToast'
import { Button } from '@/shared/ui/Button'
import { useEntry } from '../entryStore'
import { hasUnsent } from '../results'
import { sendResults, type SendOutcome } from '../sendResults'

type Props = { userId: number; competitionId: number; canSend: boolean }

const SUCCESS: SendOutcome[] = ['sent', 'replaced']

// The "Send results" button (top right of the competition).
export function SendResultsButton({ userId, competitionId, canSend }: Props) {
  const { t } = useTranslation('competitions')
  const { showSuccess, showError } = useToast()
  const entry = useEntry(userId, competitionId)
  const [sending, setSending] = useState(false)

  const send = async () => {
    // The button stays clickable when the competition is over, to say so instead of doing nothing.
    if (!canSend) {
      showError(t('send.competitionOver'))
      return
    }
    setSending(true)
    const outcome = await sendResults(userId, competitionId)
    setSending(false)
    const message = t(`send.outcome.${outcome}`)
    if (SUCCESS.includes(outcome)) showSuccess(message)
    else showError(message)
  }

  return (
    <Button
      variant="primary"
      loading={sending}
      disabled={!entry || entry.snapshot === 0}
      onClick={() => void send()}
      className="min-h-11 w-auto px-3 text-base"
    >
      {t('send.button')}
      {hasUnsent(entry) ? (
        <span aria-hidden="true" className="size-2 rounded-full bg-on-accent" />
      ) : null}
    </Button>
  )
}

// One line under the title: what the server has, and whether something is waiting.
export function SendStatus({ userId, competitionId }: { userId: number; competitionId: number }) {
  const { t, i18n } = useTranslation('competitions')
  const entry = useEntry(userId, competitionId)

  let text: string
  if (entry?.send === 'closed') text = t('send.closed')
  else if (entry?.send === 'pending') text = t('send.pending')
  else if (hasUnsent(entry)) text = t('send.unsent')
  else if (entry?.sent) {
    text = t('send.sentAt', {
      time: new Intl.DateTimeFormat(i18n.language, { timeStyle: 'short' }).format(
        new Date(entry.sent.at),
      ),
      points: entry.sent.totalPoints,
    })
  } else text = t('send.nothing')

  return (
    <p role="status" className="px-5 pb-3 text-sm font-semibold text-muted">
      {text}
    </p>
  )
}
