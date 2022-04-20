import { localizationLocalStorageKey } from '@constants'
import { Select, SelectItem } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const languages: SelectItem[] = [
  { value: 'en', label: '🇬🇧 English' },
  { value: 'cs', label: '🇨🇿 Česky' },
  { value: 'de', label: '🇩🇪 German' },
]

export const LanguageSelect = () => {
  const { t } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useLocalStorage({
    key: localizationLocalStorageKey,
    defaultValue: 'en',
  })

  const onLanguageSelect = (nextLang: string | null) => {
    setCurrentLanguage(nextLang || 'en')
    i18next.changeLanguage(nextLang || 'en')
  }

  return (
    <Select
      label={t('Admin language')}
      placeholder={t('Select an option')}
      data={languages}
      value={currentLanguage}
      onChange={onLanguageSelect}
    />
  )
}
