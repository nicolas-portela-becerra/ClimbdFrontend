import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/shared/hooks/useToast'
import { FINISH_ROLE, HAND_ROLE, START_ROLE } from '@/shared/lib/holds'
import { Button } from '@/shared/ui/Button'
import { ModalHeader } from '@/shared/ui/ModalPanel'
import type { BoulderDetails } from '../actions'
import {
  countRoles,
  isRoleFull,
  useHoldEditor,
  validateHolds,
  type EditorHold,
} from '../useHoldEditor'
import { DetailsForm } from './DetailsForm'
import { EditorCanvas } from './EditorCanvas'
import { RolePicker } from './RolePicker'

type BoulderFlowProps = {
  title: string
  submitLabel: string
  wallImageId: number
  onClose: () => void
  // Saves the boulder; throws when the server refuses.
  onSubmit: (holds: EditorHold[], details: BoulderDetails) => Promise<void>
  initialHolds?: EditorHold[]
  initialDetails?: BoulderDetails
  onForbidden?: () => void
}

const EMPTY_DETAILS: BoulderDetails = { name: '', grade: '', description: '' }

// Two steps shared by creating and editing a boulder: mark the holds on the photo, then name and grade.
// Mounted only while its modal is open, so closing the modal discards everything.
export function BoulderFlow({
  title,
  submitLabel,
  wallImageId,
  onClose,
  onSubmit,
  initialHolds,
  initialDetails = EMPTY_DETAILS,
  onForbidden,
}: BoulderFlowProps) {
  const { t } = useTranslation('editor')
  const { showError } = useToast()
  const editor = useHoldEditor(initialHolds)
  const [role, setRole] = useState<number>(HAND_ROLE)
  const [step, setStep] = useState<'holds' | 'details'>('holds')

  const counts = countRoles(editor.holds)
  const next = () => {
    const error = validateHolds(editor.holds)
    if (error) showError(t(`holdsError.${error}`))
    else setStep('details')
  }

  return (
    <>
      <ModalHeader
        title={title}
        closeLabel={t('close')}
        onClose={onClose}
        backLabel={t('back')}
        onBack={step === 'details' ? () => setStep('holds') : undefined}
      />

      {step === 'holds' ? (
        <>
          <p className="shrink-0 px-5 pb-3 text-sm text-muted">{t('hint')}</p>
          <div className="min-h-0 flex-1 bg-neutral-900">
            <EditorCanvas
              wallImageId={wallImageId}
              holds={editor.holds}
              label={t('photoLabel')}
              onTap={(point, size) => {
                const holds = editor.tap(point, role, size)
                // A role that just got full can't be used again: switch to hand holds.
                if (isRoleFull(holds, role)) setRole(HAND_ROLE)
              }}
            />
          </div>
          <div className="shrink-0 border-t-2 border-ink bg-ground px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="mb-2.5 flex items-center justify-between gap-3 font-cond text-sm font-semibold tracking-wide text-muted uppercase">
              <span>
                {counts[START_ROLE] >= 1 && counts[FINISH_ROLE] >= 1
                  ? t('status.ready', { count: editor.holds.length })
                  : t('status.needs')}
              </span>
              <span className="flex gap-2">
                <button
                  type="button"
                  disabled={!editor.canUndo}
                  onClick={editor.undo}
                  className="min-h-9 border-2 border-line px-2.5 font-bold text-ink uppercase disabled:opacity-50"
                >
                  {t('actions.undo')}
                </button>
                <button
                  type="button"
                  disabled={editor.holds.length === 0}
                  onClick={editor.clear}
                  className="min-h-9 border-2 border-line px-2.5 font-bold text-ink uppercase disabled:opacity-50"
                >
                  {t('actions.clear')}
                </button>
              </span>
            </div>
            <RolePicker
              role={role}
              counts={counts}
              fullRoles={[START_ROLE, FINISH_ROLE].filter((r) => isRoleFull(editor.holds, r))}
              onChange={setRole}
            />
            <Button variant="primary" onClick={next} className="mt-3">
              {t('actions.next')}
            </Button>
          </div>
        </>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <DetailsForm
            initialValues={initialDetails}
            submitLabel={submitLabel}
            onSubmit={async (details) => {
              await onSubmit(editor.holds, details)
              onClose()
            }}
            {...(onForbidden ? { onForbidden } : {})}
          />
        </div>
      )}
    </>
  )
}
