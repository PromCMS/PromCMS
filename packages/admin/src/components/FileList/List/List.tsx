import { apiClient } from '@api';
import ItemsMissingMessage from '@components/ItemsMissingMessage';
import { MESSAGES } from '@constants';
import { Button, Transition } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useFileListContext } from '../context';
import { useClassNames } from '../useClassNames';
import { FileItem, FileItemProps, FileItemSkeleton } from './FileItem';
import { FolderItem, FolderItemProps } from './FolderItem';
import { NewFolderCreator } from './NewFolderCreator';

export const List: FC = () => {
  const {
    isLoading,
    isError,
    files,
    showNewFolderCreator,
    updateValue,
    uploadingFiles,
    workingFolders,
    mutateFiles,
    mutateFolders,
    onToggleSelectedFile,
    selectedFileIds,
    openFilePicker,
  } = useFileListContext();
  const classNames = useClassNames();
  const { t } = useTranslation();

  const onFolderClick: FolderItemProps['onClick'] = useCallback(
    (path) => {
      updateValue('currentPath', path);
    },
    [updateValue]
  );

  const onFolderDeleteClick: FolderItemProps['onDeleteClick'] = useCallback(
    async (path) => {
      const id = notifications.show({
        loading: true,
        title: t(MESSAGES.DELETING_FOLDER),
        message: t(MESSAGES.DELETING_FOLDER) + '...',
        autoClose: false,
      });

      if (confirm(t(MESSAGES.DELETE_FOLDER_QUESTION))) {
        const folderName = path.split('/').at(-1);
        updateValue('workingFolders', {
          ...workingFolders,
          path: { type: 'deleting' },
        });

        try {
          await apiClient.library.folders.delete(path);
          mutateFolders((folders) => {
            return folders?.filter((folder) => folder !== folderName);
          });

          updateValue('workingFolders', {
            ...workingFolders,
            path: { type: 'none' },
          });

          notifications.update({
            id,
            color: 'green',
            message: t(MESSAGES.DELETING_FOLDER_DONE),
            autoClose: 2000,
            loading: false,
          });
        } catch (e) {
          console.log(e);

          if (axios.isAxiosError(e) && e.response?.status === 400) {
            notifications.update({
              id,
              color: 'red',
              message: t(MESSAGES.DELETING_FOLDER_FAILED_NOT_EMPTY),
              autoClose: 2000,
              loading: false,
            });
            return;
          }
          notifications.update({
            id,
            color: 'red',
            message: t(MESSAGES.ERROR_BASIC),
            autoClose: 2000,
            loading: false,
          });
        }
      }
    },
    [workingFolders, updateValue, mutateFolders, t]
  );

  const onFileDeleteClick: FileItemProps['onDeleteClick'] = useCallback(
    async (id) => {
      if (confirm(t(MESSAGES.DELETE_FILE_QUESTION))) {
        await apiClient.library.files.delete(id);
        mutateFiles((memory) => {
          if (!memory) return memory;

          return {
            ...memory,
            data: {
              ...memory.data,
              data: memory.data.data.filter((file) => file.id !== id),
            },
          };
        });
      }
    },
    [mutateFiles, t]
  );

  if (isLoading || isError) {
    return (
      <div className={classNames.itemsWrap}>
        {new Array(10).fill(true).map((_, index) => (
          <FileItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  const showPlaceholder =
    !files?.folders?.length && !files?.files?.length && !showNewFolderCreator;

  return (
    <div className={classNames.itemsWrap}>
      {files?.folders?.map((folder) => (
        <FolderItem
          key={folder}
          itemKey={folder}
          name={folder}
          onClick={onFolderClick}
          onDeleteClick={onFolderDeleteClick}
        />
      ))}
      {files?.files?.map((fileInfo) => (
        <FileItem
          key={fileInfo.id}
          onDeleteClick={onFileDeleteClick}
          isPicked={!!selectedFileIds?.find((item) => item.id === fileInfo.id)}
          onTogglePick={onToggleSelectedFile}
          {...fileInfo}
        />
      ))}
      <Transition
        mounted={showNewFolderCreator}
        transition="pop-top-left"
        duration={200}
        timingFunction="ease"
      >
        {(styles) => <NewFolderCreator styles={styles} />}
      </Transition>
      {Object.entries(uploadingFiles).map(([key]) => (
        <FileItemSkeleton key={key} />
      ))}
      {showPlaceholder ? (
        <>
          <div className="col-span-full flex items-center bg-white dark:bg-transparent backdrop-blur-md bg-opacity-40 dark:bg-opacity-0 shadow-blue-100 rounded-prom py-20 border-2 border-dashed border-blue-200">
            <div className="flex flex-col mx-auto">
              <ItemsMissingMessage />
              <div className="flex gap-5 mt-5">
                <Button onClick={openFilePicker}>
                  {t(MESSAGES.ADD_NEW_FILE)}
                </Button>
                <Button
                  onClick={() => updateValue('showNewFolderCreator', true)}
                >
                  {t(MESSAGES.ADD_NEW_FOLDER)}
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
