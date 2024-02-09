import { apiClient } from '@api';
import ItemsMissingMessage from '@components/ItemsMissingMessage';
import { Button, Transition } from '@mantine/core';
import {
  showNotification,
  updateNotification,
  useNotifications,
} from '@mantine/notifications';
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
  const notifications = useNotifications();
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
      const notificationId = 'Deleting folder';
      showNotification({
        id: notificationId,
        loading: true,
        title: t('Deleting folder'),
        message: t('Deleting folder') + '...',
        autoClose: false,
        disallowClose: true,
      });

      if (confirm(t('Do you really want to delete this folder?'))) {
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

          updateNotification({
            id: notificationId,
            color: 'green',
            message: t('Your folder has been deleted'),
            autoClose: 2000,
          });
        } catch (e) {
          console.log(e);

          if (axios.isAxiosError(e) && e.response?.status === 400) {
            updateNotification({
              id: notificationId,
              color: 'red',
              message: t('This folder is not empty! Delete its contents first'),
              autoClose: 2000,
            });
            return;
          }
          updateNotification({
            id: notificationId,
            color: 'red',
            message: t('An unexpected error happened'),
            autoClose: 2000,
          });
        }
      }
    },
    [workingFolders, updateValue, mutateFolders, t, notifications]
  );

  const onFileDeleteClick: FileItemProps['onDeleteClick'] = useCallback(
    async (id) => {
      if (confirm(t('Do you really want to delete this file?'))) {
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
          isPicked={selectedFileIds?.includes(String(fileInfo.id))}
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
          <div className="col-span-full flex items-center bg-white backdrop-blur-md bg-opacity-40 rounded-prom shadow-xl py-20 border-2 border-dashed border-gray-300">
            <div className="flex flex-col mx-auto">
              <ItemsMissingMessage />
              <div className="flex gap-5 mt-5">
                <Button onClick={openFilePicker}>Add new file</Button>
                <Button
                  onClick={() => updateValue('showNewFolderCreator', true)}
                >
                  Add new folder
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
