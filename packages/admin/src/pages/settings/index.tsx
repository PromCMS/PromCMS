import { ProfileLayout } from '@components/pages/UserProfile'
import { localizationLocalStorageKey } from '@constants'
import { NextPage } from '@custom-types'
import { Select, SelectItem } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const languages: SelectItem[] = [
  { value: 'en', label: '🇬🇧 English' },
  { value: 'cs', label: '🇨🇿 Česky' },
  { value: 'de', label: '🇩🇪 German' },
]

const UserProfileMainPage: NextPage = () => {
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
    <ProfileLayout>
      <div className="py-5">
        <Select
          label={t('System language')}
          placeholder={t('Select an option')}
          data={languages}
          value={currentLanguage}
          onChange={onLanguageSelect}
        />
      </div>
    </ProfileLayout>
  )
}

export default UserProfileMainPage
