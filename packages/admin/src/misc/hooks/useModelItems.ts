import { ApiResultItem, PagedResult } from '@prom-cms/shared'
import { EntryService } from '@services'
import { BareFetcher } from 'swr'
import { PublicConfiguration } from 'swr/dist/types'
import { useQuery } from '.'
import { QueryParams } from '@custom-types'

export function useModelItems<T = PagedResult<ApiResultItem>>(
  modelName: string | undefined,
  queryParams?: QueryParams,
  config?: Partial<PublicConfiguration<T, any, BareFetcher<T>>>
) {
  return useQuery<T>(
    EntryService.apiGetListUrl((modelName as string) || ''),
    queryParams,
    { isPaused: () => !modelName, ...config }
  )
}
