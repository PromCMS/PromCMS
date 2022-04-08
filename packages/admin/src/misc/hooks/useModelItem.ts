import { useGlobalContext } from '@contexts/GlobalContext'
import { ApiResultItem, ItemID } from '@prom-cms/shared'
import { EntryService } from '@services'
import useSWR from 'swr'

export const useModelItem = <T extends ApiResultItem>(
  modelName: string | undefined,
  itemId: ItemID | undefined
) => {
  const { models } = useGlobalContext()

  const shouldFetch = itemId !== undefined
  const { data, error } = useSWR<T>(
    shouldFetch && models
      ? EntryService.apiGetUrl(itemId, modelName as string)
      : null
  )

  return {
    data,
    isLoading: !error && !data,
    itemIsMissing: error,
    isError: error,
  }
}
