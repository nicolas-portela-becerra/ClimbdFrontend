import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorState } from '@/shared/ui/ErrorState'

function Fallback({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation()
  return (
    <ErrorState
      title={t('error.title')}
      message={t('error.message')}
      action={{ label: t('error.retry'), onClick: onRetry }}
    />
  )
}

// errorElement for the route tree: errors thrown while rendering or loading a route.
export function RouteError() {
  return <Fallback onRetry={() => window.location.reload()} />
}

// Root boundary for errors outside the router (providers, boot).
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  override render() {
    if (this.state.failed) return <Fallback onRetry={() => window.location.reload()} />
    return this.props.children
  }
}
