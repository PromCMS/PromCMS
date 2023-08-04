import AsideItemWrap from '@components/editorialPage/AsideItemWrap';
import { LanguageSelect } from '@components/form/LanguageSelect';
import { useGlobalContext } from '@contexts/GlobalContext';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useEntryUnderpageContext } from '../../../_context';

export const Internationalization: FC = () => {
  const { t } = useTranslation();
  const { currentView, language, setLanguage } = useEntryUnderpageContext();
  const { settings } = useGlobalContext();

  if ((settings?.i18n.languages.length ?? 0) <= 1) {
    return null;
  }

  return (
    <AsideItemWrap title={t('Internationalization')}>
      <div className="mx-5 mb-5">
        <LanguageSelect
          value={language}
          onChange={(value) => value && setLanguage(value)}
          className="w-full"
          shadow="xl"
          disabled={currentView === 'create'}
        />
      </div>
    </AsideItemWrap>
  );
};