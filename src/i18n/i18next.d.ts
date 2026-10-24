import type { defaultNS, resources } from './resources'

// Typed keys: t('auth:errors.network') is checked against the Spanish files (the reference language).
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: (typeof resources)['es']
  }
}
