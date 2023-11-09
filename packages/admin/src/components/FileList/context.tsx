import { apiClient } from '@api';
import { useFileFolder, UseFileFolderData } from '@hooks/useFileFolder';
import { showNotification, updateNotification } from '@mantine/notifications';
import { FileItem, QueryParams } from '@prom-cms/api-client';
import { createLogger } from '@utils';
import { t } from 'i18next';
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { DropzoneRootProps, useDropzone } from 'react-dropzone';
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

      const notificationId = 'on-drop-file-info';

      showNotification({
        id: notificationId,
        message: <>{t('Working')}</>,
        title: t('Uploading files...').toString(),
        color: 'blue',
        autoClose: false,
      });

      for (const { key: filePath, file } of files) {
        let isError = false;

        // Upload
        try {
          await apiClient.files.create(file, { root: currentFolder });
        } catch (e) {
          isError = true;
          updateNotification({
            id: notificationId,
            message: <>{t('Error')}</>,
            title: t('An error happened').toString(),
            color: 'red',
            autoClose: 2000,
          });

          logger.error(
            `An error happened during onDrop creation: ${(e as Error).message}`
          );
        }

        // Update files folder here
        files = files.filter(({ key }) => key !== filePath);

        // And just update for react reference
        updateValue(`uploadingFiles`, files);

        // Refetch them
        await refetchFiles();

        updateNotification({
          id: notificationId,
          message: <>{t('Success')}</>,
          title: t('All files has been uploaded').toString(),
          color: 'green',
          autoClose: 2000,
        });
      }
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
