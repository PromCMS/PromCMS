import { MESSAGES, localizationLocalStorageKey } from '@constants';
import { ComboboxData, Select } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

const languages: ComboboxData = [
  { value: 'en', label: '🇬🇧 English' },
  { value: 'cs', label: '🇨🇿 Česky' },
  { value: 'de', label: '🇩🇪 German' },
  { value: 'sk', label: '🇸🇰 Slovensky' },
];

export const LanguageSelect = () => {
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useLocalStorage({
    key: localizationLocalStorageKey,
    defaultValue: 'en',
  });

  const onLanguageSelect = (nextLang: string | null) => {
    setCurrentLanguage(nextLang || 'en');
    i18next.changeLanguage(nextLang || 'en');
  };

  return (
    <Select
      label={t(MESSAGES.ADMIN_LANGUAGE)}
      placeholder={t(MESSAGES.SELECT_PLACEHOLDER)}
      data={languages}
      value={currentLanguage}
      onChange={onLanguageSelect}
    />
  );
};
