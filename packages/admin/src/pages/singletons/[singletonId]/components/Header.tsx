import useCurrentSingleton from '@hooks/useCurrentSingleton';
import { Header as StyledHeader } from '@components/editorialPage/Header';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const Header: FC = () => {
  const { name } = useCurrentSingleton(true);
  const { t } = useTranslation();

  return (
    <StyledHeader>
      <StyledHeader.Title>
        {t('Update')} {name}
      </StyledHeader.Title>
      <StyledHeader.Divider />
    </StyledHeader>
  );
};
