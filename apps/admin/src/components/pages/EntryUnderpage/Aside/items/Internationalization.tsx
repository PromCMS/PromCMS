import AsideItemWrap from '@components/AsideItemWrap';
import { useSettings } from '@hooks/useSettings';
import { Select } from '@mantine/core';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useEntryUnderpageContext } from '../../context';

export const Internationalization: FC = () => {
  const { t } = useTranslation();
  const settings = useSettings();
  const { currentView, language, setLanguage } = useEntryUnderpageContext();

  return (
    <AsideItemWrap title={t('Internationalization')}>
      <div className="mx-5 mb-5">
        <Select
          data={settings?.i18n?.languages || []}
          label={t('Language')}
          value={language}
          onChange={(value) => value && setLanguage(value)}
          className="w-full"
          placeholder={t('Select an option')}
          shadow="xl"
          disabled={!settings || currentView === 'create'}
        />
      </div>
    </AsideItemWrap>
  );
};
