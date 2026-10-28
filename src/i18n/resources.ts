import enAuth from './locales/en/auth.json'
import enBoulders from './locales/en/boulders.json'
import enCommon from './locales/en/common.json'
import enEditor from './locales/en/editor.json'
import enGyms from './locales/en/gyms.json'
import enUsers from './locales/en/users.json'
import enWalls from './locales/en/walls.json'
import esAuth from './locales/es/auth.json'
import esBoulders from './locales/es/boulders.json'
import esCommon from './locales/es/common.json'
import esEditor from './locales/es/editor.json'
import esGyms from './locales/es/gyms.json'
import esUsers from './locales/es/users.json'
import esWalls from './locales/es/walls.json'

export const SUPPORTED_LANGUAGES = ['es', 'en'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const defaultNS = 'common'

export const resources = {
  es: {
    common: esCommon,
    auth: esAuth,
    gyms: esGyms,
    walls: esWalls,
    users: esUsers,
    boulders: esBoulders,
    editor: esEditor,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    gyms: enGyms,
    walls: enWalls,
    users: enUsers,
    boulders: enBoulders,
    editor: enEditor,
  },
} as const
