import { AsideFields } from '@components/editorialPage/AsideFields';
import { AsideWrapper } from '@components/editorialPage/AsideWrapper';
import { useAsideToggle } from 'hooks/useAsideToggle';
import useCurrentModel from 'hooks/useCurrentModel';
import { FC } from 'react';

import { CoeditorsEditor, Internationalization, PublishInfo } from './items';

export const Aside: FC = () => {
  const currentModel = useCurrentModel(true);
  const { isOpen } = useAsideToggle();

  return (
    <AsideWrapper isOpen={isOpen}>
      <PublishInfo />
      <Internationalization />
      <AsideFields model={currentModel} />
      {currentModel && currentModel.sharable && <CoeditorsEditor />}
    </AsideWrapper>
  );
};
