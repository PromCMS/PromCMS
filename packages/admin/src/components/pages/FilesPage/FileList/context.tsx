import { useFileFolder, UseFileFolderData } from '@hooks/useFileFolder'
import { File as FileType } from '@prom-cms/shared'
import { FileService } from '@services'
import { useRouter } from 'next/router'
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import { DropzoneRootProps, useDropzone } from 'react-dropzone'
import { KeyedMutator } from 'swr'
import { UploadingFilesRecord, UploadingFile } from './types'
import { formatDroppedFiles } from './utils'

type ReadonlyValues =
  | 'updateValue'
  | 'openFilePicker'
  | 'getDropZoneRootProps'
  | 'getDropZoneInputProps'
  | 'isLoading'
  | 'isError'
  | 'files'
  | 'mutateFiles'
  | 'mutateFolders'

export interface IFileListContext {
  currentPath: string
  uploadingFiles: UploadingFilesRecord
  showNewFolderCreator: boolean
  workingFolders: Record<string, { type: 'uploading' | 'deleting' | 'none' }>
  isLoading: boolean
  isError: boolean
  files: UseFileFolderData | undefined
  mutateFiles: KeyedMutator<{
    data: FileType[]
  }>
  mutateFolders: KeyedMutator<string[]>
  openFilePicker: () => void
  getDropZoneRootProps: <T extends DropzoneRootProps>(
    config: T | undefined
  ) => T | undefined
  getDropZoneInputProps: <T extends DropzoneRootProps>(
    config: T | undefined
  ) => T | undefined
  updateValue: <T extends keyof Omit<IFileListContext, ReadonlyValues>>(
    name: T | `uploadingFiles.${string}`,
    value: IFileListContext[T]
  ) => void
}

type IFileListContextValues = Omit<IFileListContext, ReadonlyValues>

const initialState: IFileListContext = {
  currentPath: '/',
  uploadingFiles: {},
  showNewFolderCreator: false,
  workingFolders: {},
  files: undefined,
  isError: false,
  isLoading: true,
  mutateFiles: (() => {}) as any,
  mutateFolders: (() => {}) as any,
  getDropZoneInputProps: () => undefined,
  getDropZoneRootProps: () => undefined,
  openFilePicker: () => {},
  updateValue: () => {},
}

export const FileListContext = createContext<IFileListContext>(initialState)

export const useFileListContext = () => useContext(FileListContext)

function reducer<T extends keyof IFileListContextValues>(
  state: IFileListContextValues,
  {
    name,
    value,
  }: { name: T | `uploadingFiles.${string}`; value: IFileListContextValues[T] }
): IFileListContextValues {
  if (name.startsWith('uploadingFiles.')) {
    const filePath = name.split('.')[1]

    return {
      ...state,
      uploadingFiles: {
        ...state.uploadingFiles,
        [filePath]: {
          ...(state.uploadingFiles[filePath] || {}),
          ...(value as unknown as UploadingFile),
        },
      } as UploadingFilesRecord,
    }
  } else {
    return { ...state, [name]: value }
  }
}

export const FileListContextProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { push, query } = useRouter()
  const currentPath = useMemo(
    () => ((query.folder as string) || '/').replaceAll('//', '/'),
    [query]
  )
  const {
    data: files,
    isError,
    isLoading,
    mutateFiles,
    mutateFolders,
  } = useFileFolder(currentPath)

  const updateValue: IFileListContext['updateValue'] = useCallback(
    (name, value) => {
      if (name === 'currentPath') {
        push({
          query: {
            folder: value as string,
          },
        })

        return
      }

      dispatch({ name, value })
    },
    [dispatch, push]
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const files = formatDroppedFiles(currentPath, acceptedFiles)
      updateValue('uploadingFiles', files)

      for (const filePath in files) {
        let isError = false
        const entry = files[filePath]

        try {
          await FileService.create(entry.file, { root: currentPath })
        } catch {
          isError = true
        }

        updateValue(`uploadingFiles.${filePath}`, {
          error: isError,
          uploaded: true,
        } as any)

        mutateFiles()
      }
    },
    [updateValue, currentPath, mutateFiles]
  )

  const {
    getInputProps: getDropZoneInputProps,
    getRootProps: getDropZoneRootProps,
    open,
  } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  })

  const openFilePicker = useCallback(() => {
    console.log('OPen')
    open()
  }, [open])

  const contextValue = useMemo(
    () => ({
      ...state,
      files,
      isError,
      isLoading,
      updateValue,
      openFilePicker,
      getDropZoneRootProps,
      getDropZoneInputProps,
      currentPath,
      mutateFiles,
      mutateFolders,
    }),
    [
      files,
      isError,
      isLoading,
      updateValue,
      openFilePicker,
      getDropZoneRootProps,
      getDropZoneInputProps,
      currentPath,
      mutateFiles,
      mutateFolders,
      state,
    ]
  )

  return (
    <FileListContext.Provider value={contextValue}>
      <input {...getDropZoneInputProps({ className: 'hidden' })} />
      {children}
    </FileListContext.Provider>
  )
}
