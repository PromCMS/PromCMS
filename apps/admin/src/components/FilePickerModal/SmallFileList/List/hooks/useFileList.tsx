import { File, PagedResult } from '@prom-cms/shared'
import { apiClient } from '@api'
import { EntryService } from '@services'
import { useQuery } from '@hooks/useQuery'
import { QueryParams } from '@custom-types'

export function useFileList<T = PagedResult<File>>(queryParams?: QueryParams) {
  return useQuery<T>(
    EntryService.getListUrl('files') + '/paged-items',
    queryParams
  )
}
