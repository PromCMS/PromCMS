import {
  localizationCookieStorageKey,
  localizationLocalStorageKey,
  localizationSessionStorageKey,
} from '@constants';
import { InitOptions } from 'i18next';

import { localizedMessages } from '../constants/localizedMessages';

export const localizationConfig: InitOptions = {
  backend: {
    loadPath: '/api/locales/{{lng}}.json',
  },
  fallbackLng: 'en',

  detection: {
    // order and from where user language should be detected
    order: ['localStorage', 'sessionStorage', 'cookie', 'navigator'],

    // keys or params to lookup language from
    lookupLocalStorage: localizationLocalStorageKey,
    lookupSessionStorage: localizationSessionStorageKey,
    lookupCookie: localizationCookieStorageKey,

    // cache user language on
    caches: ['localStorage'],
    excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

    // optional set cookie options, reference:[MDN Set-Cookie docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
    cookieOptions: { path: '/', sameSite: 'strict' },
  },
  resources: localizedMessages,
  react: {
    useSuspense: false,
    bindI18n: 'added languageChanged',
    bindI18nStore: 'added',
  },
};
