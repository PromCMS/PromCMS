import {
  PostLikeFields,
  PublishInfo,
  CoeditorsEditor,
  Internationalization,
} from './items';
import { FC } from 'react';
import useCurrentModel from '@hooks/useCurrentModel';

export const Aside: FC = () => {
  const currentModel = useCurrentModel();

  return (
    <>
      <PublishInfo />
      <Internationalization />
      <PostLikeFields />
      {currentModel && currentModel.isSharable && <CoeditorsEditor />}
    </>
  );
};
