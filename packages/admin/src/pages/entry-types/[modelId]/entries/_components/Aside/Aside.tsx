import { AsideFields } from '@components/editorialPage/AsideFields';
import { AsideWrapper } from '@components/editorialPage/AsideWrapper';
import useCurrentModel from 'hooks/useCurrentModel';
import { FC } from 'react';

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
