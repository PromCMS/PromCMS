import { apiClient } from '@api';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { FileItem, PagedResponse, QueryParams } from '@prom-cms/api-client';

export function useFileList(
  queryParams?: QueryParams,
  options?: Parameters<typeof useQuery<PagedResponse<FileItem>>>['2']
) {
  const fetcher = useCallback(
    () => apiClient.files.getMany(queryParams).then(({ data }) => data),
    [queryParams]
  );
  return useQuery<PagedResponse<FileItem>>(
    ['files', queryParams],
    fetcher,
    options
  );
}
