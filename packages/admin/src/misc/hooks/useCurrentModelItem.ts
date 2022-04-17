import { useModelItem, useRouterQuery } from '.'
import useCurrentModel from './useCurrentModel'

const useCurrentModelItem = () => {
  const modelInfo = useCurrentModel()
  const entryId = useRouterQuery('entryId')
  const itemInfo = useModelItem(
    modelInfo?.name,
    (entryId as string) || undefined,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
    }
  )

  return itemInfo
}

export default useCurrentModelItem
