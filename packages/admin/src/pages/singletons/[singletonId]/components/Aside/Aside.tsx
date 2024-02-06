import { AsideFields } from '@components/editorialPage/AsideFields';
import { AsideWrapper } from '@components/editorialPage/AsideWrapper';
import useCurrentSingleton from 'hooks/useCurrentSingleton';
import { FC } from 'react';

import { Internationalization } from './Internationalization';
import { PublishInfo } from './PublishInfo';

export const Aside: FC = () => {
  const singleton = useCurrentSingleton(true);

  return (
    <AsideWrapper isOpen>
      <PublishInfo />
      <Internationalization />
      <AsideFields model={singleton} />
    </AsideWrapper>
  );
};
