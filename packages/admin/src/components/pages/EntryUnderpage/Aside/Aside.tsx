import {
  PostLikeFields,
  PublishInfo,
  CoeditorsEditor,
  Internationalization,
} from './items';
import { FC } from 'react';
import useCurrentModel from '@hooks/useCurrentModel';
import { useAsideToggle } from '@hooks/useAsideToggle';
import { AsideWrapper } from '@components/editorialPage/AsideWrapper';

export const Aside: FC = () => {
  const currentModel = useCurrentModel();
  const { isOpen } = useAsideToggle();

  return (
    <AsideWrapper isOpen={isOpen}>
      <PublishInfo />
      <Internationalization />
      <PostLikeFields />
      {currentModel && currentModel.isSharable && <CoeditorsEditor />}
    </AsideWrapper>
  );
};
