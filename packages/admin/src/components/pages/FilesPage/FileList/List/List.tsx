import ItemsMissingMessage from '@components/ItemsMissingMessage'
import { FileService, FolderService } from '@services'
import { useCallback, VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { useFileListContext } from '../context'
import { useClassNames } from '../useClassNames'
import { FileItemSkeleton, FileItem, FileItemProps } from './FileItem'
import { FolderItem, FolderItemProps } from './FolderItem'
import { NewFolderCreator } from './NewFolderCreator'
import axios from 'axios'
import { useNotifications } from '@mantine/notifications'
import { Transition } from '@mantine/core'

export const List: VFC = () => {
  const {
    isLoading,
    isError,
    files,
    showNewFolderCreator,
    updateValue,
    workingFolders,
    mutateFiles,
    mutateFolders,
  } = useFileListContext()
  const notifications = useNotifications()
  const classNames = useClassNames()
  const { t } = useTranslation()

  const onFolderClick: FolderItemProps['onClick'] = useCallback(
    (path) => {
      updateValue('currentPath', path)
    },
    [updateValue]
  )

  const onFolderDeleteClick: FolderItemProps['onDeleteClick'] = useCallback(
    async (path) => {
      const notificationId = notifications.showNotification({
        id: 'Deleting folder',
        loading: true,
        title: 'Deleting folder',
        message: t('Deleting your folder...'),
        autoClose: false,
        disallowClose: true,
      })

      if (confirm(t('Do you really want to delete this folder?'))) {
        const folderName = path.split('/').at(-1)
        updateValue('workingFolders', {
          ...workingFolders,
          path: { type: 'deleting' },
        })

        try {
          await FolderService.delete(path)
          await mutateFolders((folders) => {
            return folders?.filter((folder) => folder !== folderName)
          })

          updateValue('workingFolders', {
            ...workingFolders,
            path: { type: 'none' },
          })

          notifications.updateNotification(notificationId, {
            color: 'green',
            message: t('Your folder has been deleted'),
            autoClose: 2000,
          })
        } catch (e) {
          if (axios.isAxiosError(e) && e.response?.status === 400) {
            notifications.updateNotification(notificationId, {
              color: 'red',
              message: t('This folder is not empty! Delete its contents first'),
              autoClose: 2000,
            })
            return
          }
          notifications.updateNotification(notificationId, {
            color: 'red',
            message: t('An unexpected error happened'),
            autoClose: 2000,
          })
        }
      }
    },
    [workingFolders, updateValue, mutateFolders, t, notifications]
  )

  const onFileDeleteClick: FileItemProps['onDeleteClick'] = useCallback(
    async (id) => {
      if (confirm(t('Do you really want to delete this file?'))) {
        await FileService.delete(id)
        await mutateFiles((memory) => {
          if (!memory) return memory

          return {
            data: memory.data.filter((file) => file.id !== id),
          }
        })
      }
    },
    [mutateFiles, t]
  )

  if (isLoading || isError) {
    return (
      <div className={classNames.itemsWrap}>
        {new Array(10).fill(true).map((_, index) => (
          <FileItemSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <>
      {files?.files?.length ||
      files?.folders?.length ||
      showNewFolderCreator ? (
        <div className={classNames.itemsWrap}>
          <>
            {files?.folders &&
              files.folders.map((folder) => (
                <FolderItem
                  key={folder}
                  itemKey={folder}
                  name={folder}
                  onClick={onFolderClick}
                  onDeleteClick={onFolderDeleteClick}
                />
              ))}
            {files?.files &&
              files.files.map((fileInfo) => (
                <FileItem
                  key={fileInfo.id}
                  onDeleteClick={onFileDeleteClick}
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
          </>
        </div>
      ) : (
        <ItemsMissingMessage />
      )}
    </>
  )
}
