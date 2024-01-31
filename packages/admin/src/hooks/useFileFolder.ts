import { apiClient } from '@api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { FileItem, QueryParams } from '@prom-cms/api-client';

import { useFolders } from './useFolders';

export interface UseFileFolderData {
  files?: FileItem[];
  folders?: string[];
}

export const useFileFolder = (
  currentPath: string,
  where?: QueryParams['where']
) => {
  const client = useQueryClient();
  const key = useMemo(
    () => ['files', currentPath, where],
    [currentPath, where]
  );
  // Implement type filter
  const {
    data: filesRes,
    isError,
    isLoading,
    refetch: refetchFiles,
  } = useQuery(key, () =>
    apiClient.library.files.getMany({
      path: currentPath,
      limit: 9999,
      // FIXME: Kinda broken types
      where: where as any,
    })
  );

  const {
    data: foldersRes,
    isError: folderQueryHasError,
    key: foldersKey,
    refetch: refetchFolders,
  } = useFolders(currentPath);

  const mutateFiles = useCallback(
    (
      param: Parameters<
        typeof client.setQueryData<NonNullable<typeof filesRes>>
      >['1']
    ) => client.setQueryData<NonNullable<typeof filesRes>>(key, param),
    [client, key]
  );
  const mutateFolders = useCallback(
    (
      param: Parameters<
        typeof client.setQueryData<NonNullable<typeof foldersRes>>
      >['1']
    ) => {
      client.setQueryData<NonNullable<typeof foldersRes>>(foldersKey, param);
    },
    [client, foldersKey]
  );

  return useMemo(
    () => ({
      data:
        filesRes?.data.data || foldersRes
          ? {
              files: filesRes?.data.data,
              folders: foldersRes,
            }
          : undefined,
      isError: isError || folderQueryHasError,
      isLoading: isLoading || (!folderQueryHasError && !foldersRes),
      mutateFiles,
      mutateFolders,
      refetchFolders,
      refetchFiles,
    }),
    [
      mutateFiles,
      mutateFolders,
      refetchFolders,
      refetchFiles,
      isLoading,
      folderQueryHasError,
      foldersRes,
      isError,
      filesRes,
    ]
  );
};
