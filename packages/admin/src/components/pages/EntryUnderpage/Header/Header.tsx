import useCurrentModel from '@hooks/useCurrentModel';
import { Header as StyledHeader } from '@components/editorialPage/Header';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useEntryUnderpageContext } from '..';
import { EditableTitle } from './EditableTitle';

export const Header: FC = () => {
  const { currentView } = useEntryUnderpageContext();
  const model = useCurrentModel();
  const { t } = useTranslation();

  return (
    <StyledHeader>
      {model?.admin?.layout === 'simple' ? (
        <>
          <StyledHeader.Title>
            {t(currentView == 'update' ? 'Update an entry' : 'Create an entry')}
          </StyledHeader.Title>
          <StyledHeader.Divider />
        </>
      ) : (
        <EditableTitle />
      )}
    </StyledHeader>
  );
};
