// import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import HttpApi from 'i18next-http-backend'
import { initReactI18next } from "react-i18next"

import translationEng from "../../assets/data/locales/en.json"
import translationTel from "../../assets/data/locales/te.json"
// import translationHin from "../../assets/data/locales/hin.json"
import i18next from "i18next"

i18next
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'te'],
    debug: false,
    //lng: "en",
    fallbackLng: "en", // use en if detected lng is not available

    detection: {
      order: ['cookie', 'path', 'htmlTag', 'localStorage'],
      caches: ['cookie']
    },

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    },
    backend: {
      loadPath: `${process.env.PUBLIC_URL}/assets/data/locales/{{lng}}.json`
    },
    resources: {
      en: {
        translations: translationEng
      },

      te: {
        translations: translationTel
      }
    },
    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations"
  })

export default i18next
