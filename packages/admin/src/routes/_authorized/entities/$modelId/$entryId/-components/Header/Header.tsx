import { Header as StyledHeader } from '@components/editorialPage/Header';
import { MESSAGES } from '@constants';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { FieldPlacements } from '@prom-cms/schema';

import { useEntryUnderpageContext } from '../../-context';
import useCurrentModel from '../../../-useCurrentModel';

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
        {t(
          currentView == 'update'
            ? MESSAGES.UPDATE_AN_ENTRY
            : MESSAGES.CREATE_AN_ENTRY
        )}
      </StyledHeader.Title>
      <StyledHeader.Divider />
    </StyledHeader>
  );
};
