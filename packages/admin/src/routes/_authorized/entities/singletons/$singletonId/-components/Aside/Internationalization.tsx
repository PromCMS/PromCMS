import AsideItemWrap from '@components/editorialPage/AsideItemWrap';
import { LanguageSelect } from '@components/form/LanguageSelect';
import { useSettings } from '@contexts/SettingsContext';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useSingletonPageContext } from '../../-context';

export const Internationalization: FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useSingletonPageContext();
  const settings = useSettings();
  if ((settings.application?.i18n.languages.length ?? 0) <= 1) {
    return null;
  }

  return (
    <AsideItemWrap title={t('Internationalization')}>
      <div className="mx-5 mb-5">
        <LanguageSelect
          value={language}
          onChange={(value) => value && setLanguage(value)}
          className="w-full"
          comboboxProps={{ shadow: 'xl' }}
        />
      </div>
    </AsideItemWrap>
  );
};
