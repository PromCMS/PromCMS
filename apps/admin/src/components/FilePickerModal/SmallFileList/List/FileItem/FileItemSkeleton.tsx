import { useClassNames } from '../../useClassNames'
import { VFC } from 'react'
import { Skeleton } from '@mantine/core'

export const FileItemSkeleton: VFC = () => {
  const classNames = useClassNames()

  return <Skeleton className={classNames.itemSquare(false)} />
}
