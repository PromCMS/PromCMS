import { PostLikeFields, PublishInfo, CoeditorsEditor } from './items'
import { FC } from 'react'
import useCurrentModel from '@hooks/useCurrentModel'

export const Aside: FC = () => {
  const currentModel = useCurrentModel()

  return (
    <>
      <PublishInfo />
      <PostLikeFields />
      {currentModel && currentModel.isSharable && <CoeditorsEditor />}
    </>
  )
}
