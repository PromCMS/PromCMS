import useCurrentSingleton from '@hooks/useCurrentSingleton';
import { Header as StyledHeader } from '@components/editorialPage/Header';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldPlacements } from '@prom-cms/shared';

export const Header: FC = () => {
  const { name, columns } = useCurrentSingleton(true);
  const { t } = useTranslation();

  const hasHeading = useMemo(
    () =>
      columns &&
      !!Object.entries(Object.fromEntries(columns)).find(
        ([_, data]) =>
          !data.hide &&
          data.editable &&
          data.admin.editor.placement === FieldPlacements.MAIN &&
          data.type === 'string' &&
          data.admin.fieldType === 'heading'
      ),
    [columns]
  );

  if (hasHeading) {
    return null;
  }

  return (
    <StyledHeader>
      <StyledHeader.Title>
        {t('Update')} {name}
      </StyledHeader.Title>
      <StyledHeader.Divider />
    </StyledHeader>
  );
};
