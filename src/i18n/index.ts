import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { storage } from '@/shared/lib/storage'
import { defaultNS, resources, SUPPORTED_LANGUAGES, type Language } from './resources'

export const LANGUAGE_KEY = 'climbd.lang'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    supportedLngs: SUPPORTED_LANGUAGES,
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    fallbackLng: 'es',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_KEY,
      // Not cached on detection: the device language keeps being followed until the user chooses one.
      caches: [],
    },
    interpolation: { escapeValue: false },
  })

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language
})
document.documentElement.lang = i18n.resolvedLanguage ?? 'es'

// The only place that persists the user's explicit language choice.
export async function setLanguage(language: Language): Promise<void> {
  storage.set(LANGUAGE_KEY, language)
  await i18n.changeLanguage(language)
}

export default i18n
