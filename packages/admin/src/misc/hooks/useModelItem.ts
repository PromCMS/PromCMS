import { useGlobalContext } from '@contexts/GlobalContext'
import { ApiResultItem, ItemID } from '@prom-cms/shared'
import { EntryService } from '@services'
import { useEffect } from 'react'
import { useMemo } from 'react'
import useSWR from 'swr'
import type { PublicConfiguration, BareFetcher } from 'swr/dist/types'

export const useModelItem = <T extends ApiResultItem>(
  modelName: string | undefined,
  itemId: ItemID | undefined,
  config?: Partial<PublicConfiguration<T, any, BareFetcher<T>>>
) => {
  const { models } = useGlobalContext()
  const shouldFetch = useMemo(() => itemId !== undefined, [itemId])

  const { data, error, mutate } = useSWR<T>(
    shouldFetch && models
      ? EntryService.apiGetUrl(itemId!, modelName as string)
      : null,
    config
  )

  return useMemo(
    () => ({
      data,
      isLoading: !error && !data,
      itemIsMissing: error,
      isError: error,
      mutate,
    }),
    [data, error, mutate]
  )
}
