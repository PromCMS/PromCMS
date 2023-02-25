import { AsideFields } from '@components/editorialPage/AsideFields';
import { AsideWrapper } from '@components/editorialPage/AsideWrapper';
import { useAsideToggle } from '@hooks/useAsideToggle';
import useCurrentSingleton from '@hooks/useCurrentSingleton';
import { FC } from 'react';
import { Internationalization } from './Internationalization';
import { PublishInfo } from './PublishInfo';

export const Aside: FC = () => {
  const singleton = useCurrentSingleton(true);
  const { isOpen } = useAsideToggle();

  return (
    <AsideWrapper isOpen={isOpen}>
      <PublishInfo />
      <Internationalization />
      <AsideFields model={singleton} />
    </AsideWrapper>
  );
};
