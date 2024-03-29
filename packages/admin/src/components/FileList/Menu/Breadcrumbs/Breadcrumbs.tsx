import { VFC, useCallback, useMemo } from 'react';
import { Folders, Home } from 'tabler-icons-react';

import { useFileListContext } from '../../context';
import { Item } from './Item';

export const Breadcrumbs: VFC = () => {
  const { currentPath, updateValue } = useFileListContext();

  const pathPieces = useMemo(
    () => currentPath.split('/').filter((folderName) => !!folderName),
    [currentPath]
  );

  const goToPath = useCallback(
    (path: string) => () => {
      updateValue('currentPath', path);
    },
    [updateValue]
  );

  return (
    <nav
      role="navigation"
      className="flex w-full overflow-auto items-center ml-2"
    >
      <Item icon={Home} onClick={goToPath('/')} isLast={!pathPieces.length} />
      {pathPieces.map((folderName, index) => (
        <Item
          key={folderName}
          icon={Folders}
          label={'/' + pathPieces.slice(0, index + 1).join('/')}
          onClick={goToPath('/' + pathPieces.slice(0, index + 1).join('/'))}
          title={folderName}
          isLast={index === pathPieces.length - 1}
        />
      ))}
    </nav>
  );
};
