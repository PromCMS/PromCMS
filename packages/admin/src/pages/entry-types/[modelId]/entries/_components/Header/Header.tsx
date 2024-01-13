import { Header as StyledHeader } from '@components/editorialPage/Header';
import useCurrentModel from 'hooks/useCurrentModel';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { FieldPlacements } from '@prom-cms/schema';

import { useEntryUnderpageContext } from '../../_context';

export const Header: FC = () => {
  const { currentView } = useEntryUnderpageContext();
  const model = useCurrentModel();
  const { t } = useTranslation();
  const hasHeading = useMemo(
    () =>
      model?.columns &&
      !!model?.columns.find(
        (data) =>
          !data.hide &&
          data.admin.editor.placement === FieldPlacements.MAIN &&
          data.type === 'string' &&
          data.admin.fieldType === 'heading'
      ),
    [model]
  );

  if (hasHeading) {
    return null;
  }

  return (
    <StyledHeader>
      <StyledHeader.Title>
        {t(currentView == 'update' ? 'Update an entry' : 'Create an entry')}
      </StyledHeader.Title>
      <StyledHeader.Divider />
    </StyledHeader>
  );
};
