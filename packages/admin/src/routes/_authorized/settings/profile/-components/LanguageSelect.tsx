import { MESSAGES, adminLanguages } from '@constants';
import { Select } from '@mantine/core';
import { useTranslation } from 'react-i18next';

const languages: Array<{ value: keyof typeof adminLanguages; label: string }> =
  [
    { value: 'cs', label: '🇨🇿 Česky' },
    { value: 'en', label: '🇬🇧 English' },
    { value: 'fr', label: '🇫🇷 Français' },
    { value: 'sk', label: '🇸🇰 Slovensky' },
    { value: 'de', label: '🇩🇪 Allemand' },
  ];

export const LanguageSelect = () => {
  const { t, i18n } = useTranslation();

  const onLanguageSelect = (nextLang: string | null) => {
    i18n.changeLanguage(nextLang || 'en');
  };

  return (
    <Select
      label={t(MESSAGES.ADMIN_LANGUAGE)}
      placeholder={t(MESSAGES.SELECT_PLACEHOLDER)}
      data={languages}
      value={i18n.language}
      onChange={onLanguageSelect}
      allowDeselect
    />
  );
};
