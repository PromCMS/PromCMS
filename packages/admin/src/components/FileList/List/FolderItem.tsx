import { ActionIcon } from '@mantine/core';
import clsx from 'clsx';
import { VFC, useCallback, useMemo, useState } from 'react';
import { Folder, Folders, Trash } from 'tabler-icons-react';

import { useFileListContext } from '../context';
import { useClassNames } from '../useClassNames';

export interface Folder {
  itemKey: string;
  name: string;
}

export interface FolderItemProps extends Folder {
  onClick: (path: string) => void;
  onDeleteClick: (path: string) => void;
}

export const FolderItem: VFC<FolderItemProps> = ({
  itemKey,
  name,
  onClick,
  onDeleteClick,
}) => {
  const { currentPath, workingFolders } = useFileListContext();
  const [isHovering, setIsHovering] = useState(false);
  const classNames = useClassNames();
  const folderPath = useMemo(
    () => `${currentPath === '/' ? '' : currentPath}/${itemKey}`,
    [itemKey, currentPath]
  );

  const toggleHover = () => setIsHovering(!isHovering);
  const CustomFolderIcon = useMemo(
    () => (isHovering ? Folders : Folder),
    [isHovering]
  );

  const onFolderClick = useCallback(
    () => onClick(folderPath),
    [onClick, folderPath]
  );

  const onFolderDeleteClick = useCallback(
    () => onDeleteClick(folderPath),
    [onDeleteClick, folderPath]
  );

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
        <CustomFolderIcon className="m-auto block h-16 w-16 text-blue-500" />
      </div>
      <h3
        className={clsx(classNames.itemLabel, 'cursor-pointer text-left')}
        onClick={onFolderClick}
      >
        {name}
      </h3>
      <div className="absolute top-0 right-0 m-2.5">
        <ActionIcon
          onClick={onFolderDeleteClick}
          size={31}
          color="red"
          disabled={
            workingFolders[folderPath]?.type === 'deleting' ||
            workingFolders[folderPath]?.type === 'uploading'
          }
        >
          <Trash size={20} />
        </ActionIcon>
      </div>
    </div>
  );
};
