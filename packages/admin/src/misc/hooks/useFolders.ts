import { API_ENTRY_TYPES_URL } from '@constants'
import useSWR from 'swr'

export const getUseFoldersRoute = (path: string) =>
  `${API_ENTRY_TYPES_URL}/folders?path=${path}`

export const useFolders = (path: string) =>
  useSWR<string[]>(getUseFoldersRoute(path), {
    isPaused: () => !path,
  })
