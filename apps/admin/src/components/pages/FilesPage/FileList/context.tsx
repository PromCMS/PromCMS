import { apiClient } from '@api';
import { useFileFolder, UseFileFolderData } from '@hooks/useFileFolder';
import { useRouterQuery } from '@hooks/useRouterQuery';
import { showNotification, updateNotification } from '@mantine/notifications';
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
import { useNavigate } from 'react-router-dom';
import { UploadingFilesRecord } from './types';
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
  uploadingFiles: UploadingFilesRecord;
  showNewFolderCreator: boolean;
  workingFolders: Record<string, { type: 'uploading' | 'deleting' | 'none' }>;
  isLoading: boolean;
  isError: boolean;
  files: UseFileFolderData | undefined;
  mutateFiles: ReturnType<typeof useFileFolder>['mutateFiles'];
  mutateFolders: ReturnType<typeof useFileFolder>['mutateFolders'];
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

export const FileListContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const currentFolder = useRouterQuery('folder');
  const navigate = useNavigate();
  const currentPath = useMemo(
    () => ((currentFolder as string) || '/').replaceAll('//', '/'),
    [currentFolder]
  );
  const {
    data: filesAndFolders,
    isError,
    isLoading,
    mutateFiles,
    mutateFolders,
    refetchFiles,
  } = useFileFolder(currentPath);

  const updateValue: IFileListContext['updateValue'] = useCallback(
    (name, value) => {
      if (name === 'currentPath') {
        navigate({
          search: `?folder=${value}`,
        });

        return;
      }

      dispatch({ name, value });
    },
    [dispatch, navigate]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const files = formatDroppedFiles(currentPath, acceptedFiles);

      updateValue('uploadingFiles', files);

      const notificationId = 'on-drop-file-info';

      showNotification({
        id: notificationId,
        message: <>{t('Working')}</>,
        title: t('Uploading files...').toString(),
        color: 'blue',
        autoClose: false,
      });

      for (const filePath in files) {
        let isError = false;
        const entry = files[filePath];

        try {
          await apiClient.files.create(entry.file, { root: currentPath });
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

        updateValue(
          `uploadingFiles`,
          Object.fromEntries(
            Object.entries(files).filter(([key]) => key !== filePath)
          ) as UploadingFilesRecord
        );

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
    [updateValue, currentPath, mutateFiles]
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
      files: filesAndFolders,
      isError,
      isLoading,
      updateValue,
      openFilePicker: open,
      getDropZoneRootProps,
      getDropZoneInputProps,
      currentPath,
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
      currentPath,
      mutateFiles,
      mutateFolders,
      state,
    ]
  );

  return (
    <FileListContext.Provider value={contextValue}>
      <input {...getDropZoneInputProps({ className: 'hidden' })} />
      {children}
    </FileListContext.Provider>
  );
};
