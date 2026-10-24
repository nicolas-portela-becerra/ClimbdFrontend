import { registerSW } from 'virtual:pwa-register'

// registerType is 'autoUpdate' (vite.config.ts): a new version is applied silently on the next load.
export function registerServiceWorker(): void {
  registerSW({ immediate: true })
}
