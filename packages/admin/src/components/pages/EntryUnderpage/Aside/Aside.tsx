import { PublishInfo, CoeditorsEditor, Internationalization } from './items';
import { FC } from 'react';
import useCurrentModel from '@hooks/useCurrentModel';
import { useAsideToggle } from '@hooks/useAsideToggle';
import { AsideWrapper } from '@components/editorialPage/AsideWrapper';
import { AsideFields } from '@components/editorialPage/AsideFields';

export const Aside: FC = () => {
  const currentModel = useCurrentModel(true);
  const { isOpen } = useAsideToggle();

  return (
    <AsideWrapper isOpen={isOpen}>
      <PublishInfo />
      <Internationalization />
      <AsideFields model={currentModel} />
      {currentModel && currentModel.isSharable && <CoeditorsEditor />}
    </AsideWrapper>
  );
};
