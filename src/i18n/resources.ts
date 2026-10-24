import enAuth from './locales/en/auth.json'
import enBoulders from './locales/en/boulders.json'
import enCommon from './locales/en/common.json'
import enEditor from './locales/en/editor.json'
import enGyms from './locales/en/gyms.json'
import esAuth from './locales/es/auth.json'
import esBoulders from './locales/es/boulders.json'
import esCommon from './locales/es/common.json'
import esEditor from './locales/es/editor.json'
import esGyms from './locales/es/gyms.json'

export const SUPPORTED_LANGUAGES = ['es', 'en'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const defaultNS = 'common'

export const resources = {
  es: { common: esCommon, auth: esAuth, gyms: esGyms, boulders: esBoulders, editor: esEditor },
  en: { common: enCommon, auth: enAuth, gyms: enGyms, boulders: enBoulders, editor: enEditor },
} as const
