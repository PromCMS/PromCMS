import { Header as StyledHeader } from '@components/editorialPage/Header';
import { MESSAGES } from '@constants';
import useCurrentSingleton from 'hooks/useCurrentSingleton';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { FieldPlacements } from '@prom-cms/schema';

export const Header: FC = () => {
  const { name, title, columns } = useCurrentSingleton(true);
  const { t } = useTranslation();

  const hasHeading = useMemo(
    () =>
      columns &&
      !!columns.find(
        (data) =>
          !data.hide &&
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
        {t(MESSAGES.UPDATE_ITEM)} {title || name}
      </StyledHeader.Title>
      <StyledHeader.Divider />
    </StyledHeader>
  );
};
