import useCurrentModel from '@hooks/useCurrentModel';
import { Header as StyledHeader } from '@components/editorialPage/Header';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useEntryUnderpageContext } from '../../_context';
import { FieldPlacements } from '@prom-cms/schema';

export const Header: FC = () => {
  const { currentView } = useEntryUnderpageContext();
  const model = useCurrentModel();
  const { t } = useTranslation();
  const hasHeading = useMemo(
    () =>
      model?.columns &&
      !!Object.entries(Object.fromEntries(model?.columns)).find(
        ([_, data]) =>
          !data.hide &&
          data.editable &&
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