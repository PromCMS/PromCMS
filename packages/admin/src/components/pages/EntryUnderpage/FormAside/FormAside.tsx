import clsx from 'clsx'
import { useClassNames } from '../useClassNames'
import { PermissionsEditor, PostLikeFields, PublishInfo } from './items'
import { FC } from 'react'
import useCurrentModel from '@hooks/useCurrentModel'

export const FormAside: FC = () => {
  const classes = useClassNames()
  const currentModel = useCurrentModel()

  return (
    <aside className={clsx(classes.aside, 'sticky top-0 pr-5')}>
      <PublishInfo />
      <PostLikeFields />
      {currentModel && currentModel.hasPermissions && <PermissionsEditor />}
    </aside>
  )
}
