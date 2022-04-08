import { useClassNames } from '../../useClassNames'
import { VFC } from 'react'

export const FileItemSkeleton: VFC = () => {
  const classNames = useClassNames()

  return <div className={classNames.itemSquare(false)} />
}
