import { MESSAGES } from '@constants';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from '../_context';

export const Header: FC = () => {
  const { view } = useData();
  const { t } = useTranslation();

  return (
    <header className="mr-9 w-full border-b-2 border-project-border pb-5 xl:mr-0">
      <h1 className="m-0 text-5xl font-bold">
        {t(
          view == 'update' ? MESSAGES.UPDATE_AN_USER : MESSAGES.CREATE_AN_USER
        )}
      </h1>
    </header>
  );
};
