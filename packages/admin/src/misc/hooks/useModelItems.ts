import { ApiResultItem, PagedResult } from '@prom-cms/shared'
import { apiClient } from '@api'
import { EntryService } from '@services'
import useSWR, { BareFetcher } from 'swr'
import { PublicConfiguration } from 'swr/dist/types'

type QueryParams =
  | {
      page?: number
      where?: Record<
        string,
        | {
            value: string | number
            manipulator: 'LIKE' | '>' | '<' | '=' | string
          }
        | {
            value: (string | number)[]
            manipulator: 'IN'
          }
      >
    }
  | Record<string, string | number>

const fetcher = (url, params = {}) =>
  apiClient.get(url, { params }).then((res) => res.data)

const formatQueryParams = ({ where, ...restParams }: QueryParams) => {
  const params: Record<string, string | number> = { ...restParams }

  if (where) {
    params['where'] = Object.entries(where || {})
      .map(([key, { manipulator, value }]) => `${key}.${manipulator}.${value}`)
      .join(';')
  }

  return params
}

export function useModelItems<T = PagedResult<ApiResultItem>>(
  modelName: string | undefined,
  queryParams?: QueryParams,
  config?: Partial<PublicConfiguration<T, any, BareFetcher<T>>>
) {
  const { data, error, ...rest } = useSWR<T>(
    [
      EntryService.apiGetListUrl((modelName as string) || ''),
      formatQueryParams(queryParams ?? {}),
    ],
    fetcher,
    {
      isPaused: () => !modelName,
      ...config,
    }
  )

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    ...rest,
  }
}
