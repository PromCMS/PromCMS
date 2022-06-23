import { File, PagedResult } from '@prom-cms/shared'
import { apiClient } from '@api'
import { EntryService } from '@services'
import useSWR from 'swr'

const fetcher = (url, params = {}) =>
  apiClient.get(url, { params }).then((res) => res.data)

export function useFileList<T = PagedResult<File>>(
  config?: { page?: number } & Record<string, string | number>
) {
  const { data, error, ...rest } = useSWR<T>(
    [EntryService.getListUrl('files') + '/paged-items', config],
    fetcher
  )

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    ...rest,
  }
}
