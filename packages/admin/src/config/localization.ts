import { InitOptions } from 'i18next'

export const localizationConfig: InitOptions = {
  backend: {
    loadPath: '/api/locales/{{lng}}.json',
  },
  fallbackLng: false,
  detection: {
    // order and from where user language should be detected
    order: [
      'localStorage',
      'sessionStorage',
      'querystring',
      'navigator',
      'htmlTag',
      'path',
      'subdomain',
    ],

    // keys or params to lookup language from
    lookupQuerystring: 'lng',
    lookupLocalStorage: 'i18nextLng',
    lookupSessionStorage: 'i18nextLng',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,

    // cache user language on
    caches: ['localStorage', 'cookie'],
    excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

    // optional set cookie options, reference:[MDN Set-Cookie docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
    cookieOptions: { path: '/', sameSite: 'strict' },
  },
  react: {
    useSuspense: false,
  },
}
