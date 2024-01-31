import { apiClient } from '@api';
import { MESSAGES } from '@constants';
import { showNotification, updateNotification } from '@mantine/notifications';
import { createLogger } from '@utils';
import { UseFileFolderData, useFileFolder } from 'hooks/useFileFolder';
import { t } from 'i18next';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { DropzoneRootProps, useDropzone } from 'react-dropzone';

import {
  FileItem,
  FileTooLargeError,
  QueryParams,
  UnsupportedFileExtensionError,
} from '@prom-cms/api-client';

import { UploadingFiles } from './types';
import { formatDroppedFiles } from './utils';

type ReadonlyValues =
  | 'updateValue'
  | 'openFilePicker'
  | 'getDropZoneRootProps'
  | 'getDropZoneInputProps'
  | 'isLoading'
  | 'isError'
  | 'files'
  | 'mutateFiles'
  | 'mutateFolders';

export interface IFileListContext {
  currentPath: string;
  uploadingFiles: UploadingFiles;
  showNewFolderCreator: boolean;
  workingFolders: Record<string, { type: 'uploading' | 'deleting' | 'none' }>;
  isLoading: boolean;
  isError: boolean;
  files: UseFileFolderData | undefined;
  mutateFiles: ReturnType<typeof useFileFolder>['mutateFiles'];
  mutateFolders: ReturnType<typeof useFileFolder>['mutateFolders'];
  selectedFileIds?: FileItem['id'][];
  onToggleSelectedFile?: (
    selectedFileId: FileItem['id'],
    isSelected: boolean
  ) => void;

  openFilePicker: () => void;
  getDropZoneRootProps: <T extends DropzoneRootProps>(
    config: T | undefined
  ) => T | undefined;
  getDropZoneInputProps: <T extends DropzoneRootProps>(
    config: T | undefined
  ) => T | undefined;
  updateValue: <T extends keyof Omit<IFileListContext, ReadonlyValues>>(
    name: T | `uploadingFiles.${string}`,
    value: IFileListContext[T]
  ) => void;
}

type IFileListContextValues = Omit<IFileListContext, ReadonlyValues>;

const initialState: IFileListContext = {
  currentPath: '/',
  uploadingFiles: [],
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
};

export const FileListContext = createContext<IFileListContext>(initialState);

export const useFileListContext = () => useContext(FileListContext);

function reducer<T extends keyof IFileListContextValues>(
  state: IFileListContextValues,
  {
    name,
    value,
  }: { name: T | `uploadingFiles.${string}`; value: IFileListContextValues[T] }
): IFileListContextValues {
  return { ...state, [name]: value };
}

const logger = createLogger('FileListContextProvider');

export interface FileListProviderProps
  extends Pick<IFileListContext, 'onToggleSelectedFile' | 'selectedFileIds'> {
  currentFolder: string;
  onFolderChange: (nextFolderPath: string) => void;
  fileQueryParameters?: Pick<QueryParams, 'where'>;
}

export const FileListContextProvider: FC<
  PropsWithChildren<FileListProviderProps>
> = ({
  children,
  currentFolder,
  onFolderChange,
  onToggleSelectedFile,
  selectedFileIds,
  fileQueryParameters,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    data: filesAndFolders,
    isError,
    isLoading,
    mutateFiles,
    mutateFolders,
    refetchFiles,
  } = useFileFolder(currentFolder, fileQueryParameters?.where);

  const updateValue: IFileListContext['updateValue'] = useCallback(
    (name, value) => {
      if (name === 'currentPath') {
        onFolderChange(String(value));
        return;
      }

      dispatch({ name, value });
    },
    [dispatch]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      let files = formatDroppedFiles(currentFolder, acceptedFiles);

      updateValue('uploadingFiles', files);

      const rootNotificationId = 'on-drop-file-info';

      showNotification({
        id: rootNotificationId,
        title: t(MESSAGES.UPLOADING).toString(),
        message: t(MESSAGES.UPLOADING_FILES).toString(),
        color: 'blue',
        autoClose: false,
      });

      for (const { key: filePath, file } of files) {
        try {
          await apiClient.library.files.create(file, { root: currentFolder });
        } catch (error) {
          let reason = t(MESSAGES.FILE_CANNOT_BE_UPLOADED).toString();

          if (error instanceof FileTooLargeError) {
            reason += ' ';
            reason += t(MESSAGES.FILE_TOO_LARGE).toString();
          } else if (error instanceof UnsupportedFileExtensionError) {
            reason += ' ';
            reason += t(MESSAGES.FILE_EXTENSION_UNSUPPORTED)
              .toString()
              .replaceAll(
                '{{extension}}',
                file.name.split('.').at(-1) ?? 'extension'
              );
          }

          showNotification({
            id: `failed-upload-${file.name}`,
            title: t(MESSAGES.UPLOADING_FAILED).toString(),
            message: reason.replaceAll('{{fileName}}', file.name ?? 'file'),
            color: 'red',
            autoClose: 8000,
          });

          logger.error(error as Error);
        }

        // Update files folder here
        files = files.filter(({ key }) => key !== filePath);

        // And just update for react reference
        updateValue(`uploadingFiles`, files);

        // Refetch them
        await refetchFiles();
      }

      updateNotification({
        id: rootNotificationId,
        title: <>{t(MESSAGES.UPLOADING_FINISHED)}</>,
        message: t(MESSAGES.ALL_FILES_HAS_BEEN_PROCESSED).toString(),
        color: 'green',
        autoClose: 3000,
      });
    },
    [updateValue, currentFolder, mutateFiles]
  );

  const {
    getInputProps: getDropZoneInputProps,
    getRootProps: getDropZoneRootProps,
    open,
  } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const contextValue = useMemo(
    () => ({
      ...state,
      onToggleSelectedFile,
      selectedFileIds,
      files: filesAndFolders,
      isError,
      isLoading,
      updateValue,
      openFilePicker: open,
      getDropZoneRootProps,
      getDropZoneInputProps,
      // TODO: rename
      currentPath: currentFolder,
      mutateFiles,
      mutateFolders,
    }),
    [
      filesAndFolders,
      isError,
      isLoading,
      updateValue,
      open,
      getDropZoneRootProps,
      getDropZoneInputProps,
      currentFolder,
      mutateFiles,
      mutateFolders,
      state,
      onToggleSelectedFile,
      selectedFileIds,
    ]
  );

  return (
    <FileListContext.Provider value={contextValue}>
      <input {...getDropZoneInputProps({ className: 'hidden' })} />
      {children}
    </FileListContext.Provider>
  );
};
