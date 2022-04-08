import { File } from '@prom-cms/shared'
import { useFolders } from './useFolders'
import { useModelItems } from './useModelItems'

export interface UseFileFolderData {
  files?: File[]
  folders?: string[]
}

export const useFileFolder = (currentPath: string) => {
  const {
    data: filesRes,
    isError,
    isLoading,
    mutate: mutateFiles,
  } = useModelItems<{ data: File[] }>('files', { path: currentPath })

  const {
    data: foldersRes,
    error,
    mutate: mutateFolders,
  } = useFolders(currentPath)

  return {
    data:
      filesRes?.data || foldersRes
        ? {
            files: filesRes?.data,
            folders: foldersRes,
          }
        : undefined,
    isError: isError || error,
    isLoading: isLoading || (!error && !foldersRes),
    mutateFiles,
    mutateFolders,
  }
}
