import { useModelItem, useRouterQuery } from '.'
import useCurrentModel from './useCurrentModel'

const useModelItemConfig = {
  refreshInterval: 0,
  revalidateOnFocus: false,
  revalidateIfStale: false,
  revalidateOnMount: true,
  revalidateOnReconnect: false,
}

const useCurrentModelItem = () => {
  const modelInfo = useCurrentModel()
  const entryId = useRouterQuery('entryId')
  const itemInfo = useModelItem(
    modelInfo?.name,
    (entryId as string) || undefined,
    useModelItemConfig
  )

  return itemInfo
}

export default useCurrentModelItem
