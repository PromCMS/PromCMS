import { AsideFields } from '@components/editorialPage/AsideFields';
import { AsideWrapper } from '@components/editorialPage/AsideWrapper';
import { FC } from 'react';

import useCurrentModel from '../../../-useCurrentModel';
import { CoeditorsEditor, PublishInfo } from './items';

export const Aside: FC = () => {
  const currentModel = useCurrentModel(true);

  return (
    <AsideWrapper isOpen>
      <PublishInfo />
      <AsideFields model={currentModel} />
      {currentModel && currentModel.sharable && <CoeditorsEditor />}
    </AsideWrapper>
  );
};
