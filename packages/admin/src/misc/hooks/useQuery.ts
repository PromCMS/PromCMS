import { apiClient } from '@api'
import { QueryParams } from '@custom-types'
import useSWR, { BareFetcher } from 'swr'
import { PublicConfiguration } from 'swr/dist/types'

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

export function useQuery<T = Record<string, any>>(
  url: string,
  queryParams?: QueryParams,
  config?: Partial<PublicConfiguration<T, any, BareFetcher<T>>>
) {
  const { data, error, ...rest } = useSWR<T>(
    [url, formatQueryParams(queryParams ?? {})],
    fetcher,
    config
  )

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    ...rest,
  }
}
