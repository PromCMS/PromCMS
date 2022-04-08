import { useModelItem, useRouterQuery } from '.'
import useCurrentModel from './useCurrentModel'

const useCurrentModelItem = () => {
  const modelInfo = useCurrentModel()
  const entryId = useRouterQuery('entryId')
  const itemInfo = useModelItem(
    modelInfo?.name,
    (entryId as string) || undefined
  )

  return itemInfo
}

export default useCurrentModelItem
