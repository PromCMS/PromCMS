import { FileItem } from '@prom-cms/api-client';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useFolders } from './useFolders';
import { useModelItems } from './useModelItems';

export interface UseFileFolderData {
  files?: FileItem[];
  folders?: string[];
}

export const useFileFolder = (currentPath: string) => {
  const { setQueryData } = useQueryClient();
  const {
    data: filesRes,
    isError,
    isLoading,
    key: filesQueryKey,
    refetch: refetchFiles,
  } = useModelItems<FileItem>('files', {
    params: { path: currentPath, limit: 9999 },
  });

  const {
    data: foldersRes,
    isError: folderQueryHasError,
    key: foldersKey,
    refetch: refetchFolders,
  } = useFolders(currentPath);

  const mutateFiles = useCallback(
    (
      param: Parameters<typeof setQueryData<NonNullable<typeof filesRes>>>['1']
    ) => setQueryData<NonNullable<typeof filesRes>>(filesQueryKey, param),
    [setQueryData, filesQueryKey]
  );
  const mutateFolders = useCallback(
    (
      param: Parameters<
        typeof setQueryData<NonNullable<typeof foldersRes>>
      >['1']
    ) => setQueryData<NonNullable<typeof foldersRes>>(foldersKey, param),
    [setQueryData]
  );

  return useMemo(
    () => ({
      data:
        filesRes?.data || foldersRes
          ? {
              files: filesRes?.data,
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
