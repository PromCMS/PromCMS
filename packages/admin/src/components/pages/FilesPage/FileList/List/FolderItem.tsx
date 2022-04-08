import IconButton from '@components/IconButton'
import { FolderIcon, FolderOpenIcon, TrashIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import { useCallback, useMemo, useState, VFC } from 'react'
import { useFileListContext } from '../context'
import { useClassNames } from '../useClassNames'

export interface Folder {
  itemKey: string
  name: string
}

export interface FolderItemProps extends Folder {
  onClick: (path: string) => void
  onDeleteClick: (path: string) => void
}

export const FolderItem: VFC<FolderItemProps> = ({
  itemKey,
  name,
  onClick,
  onDeleteClick,
}) => {
  const { currentPath, workingFolders } = useFileListContext()
  const [isHovering, setIsHovering] = useState(false)
  const classNames = useClassNames()
  const folderPath = useMemo(
    () => `${currentPath === '/' ? '' : currentPath}/${itemKey}`,
    [itemKey, currentPath]
  )

  const toggleHover = () => setIsHovering(!isHovering)
  const CustomFolderIcon = useMemo(
    () => (isHovering ? FolderOpenIcon : FolderIcon),
    [isHovering]
  )

  const onFolderClick = useCallback(
    () => onClick(folderPath),
    [onClick, folderPath]
  )

  const onFolderDeleteClick = useCallback(
    () => onDeleteClick(folderPath),
    [onDeleteClick, folderPath]
  )

  return (
    <div
      className={classNames.itemRoot}
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
      role="link"
    >
      <div
        className={clsx(classNames.itemSquare(), 'flex cursor-pointer')}
        onClick={onFolderClick}
      >
        <CustomFolderIcon className="m-auto w-28 text-blue-500" />
      </div>
      <h1
        className={clsx(classNames.itemLabel, 'cursor-pointer text-left')}
        onClick={onFolderClick}
      >
        {name}
      </h1>
      <div className="absolute top-0 right-0 m-2.5">
        <IconButton
          icon={TrashIcon}
          onClick={onFolderDeleteClick}
          className="border-2 border-project-border shadow-lg duration-200 hover:border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
          disabled={
            workingFolders[folderPath]?.type === 'deleting' ||
            workingFolders[folderPath]?.type === 'uploading'
          }
        />
      </div>
    </div>
  )
}
