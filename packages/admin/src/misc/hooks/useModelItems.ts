import { ApiResultItem, PagedResult } from '@prom-cms/shared'
import { apiClient } from '@api'
import { EntryService } from '@services'
import useSWR from 'swr'

const fetcher = (url, params = {}) =>
  apiClient.get(url, { params }).then((res) => res.data)

export function useModelItems<T = PagedResult<ApiResultItem>>(
  modelName: string | undefined,
  config?: { page?: number } & Record<string, string | number>
) {
  const { data, error, ...rest } = useSWR<T>(
    [EntryService.apiGetListUrl((modelName as string) || ''), config],
    fetcher,
    {
      isPaused: () => !modelName,
    }
  )

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    ...rest,
  }
}
