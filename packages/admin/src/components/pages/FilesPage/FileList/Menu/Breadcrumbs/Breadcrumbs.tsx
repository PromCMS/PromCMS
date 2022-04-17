import { iconSet } from '@prom-cms/icons'
import { useCallback, useMemo, VFC } from 'react'
import { useFileListContext } from '../../context'
import { Item } from './Item'

export const Breadcrumbs: VFC = () => {
  const { currentPath, updateValue } = useFileListContext()

  const pathPieces = useMemo(
    () => currentPath.split('/').filter((folderName) => !!folderName),
    [currentPath]
  )

  const goToPath = useCallback(
    (path: string) => () => {
      updateValue('currentPath', path)
    },
    [updateValue]
  )

  return (
    <nav
      role="navigation"
      className="flex w-full items-center overflow-auto rounded-2xl border-2 border-project-border bg-white px-4"
    >
      <Item
        icon={iconSet.Home}
        onClick={goToPath('/')}
        isLast={!pathPieces.length}
      />
      {pathPieces.map((folderName, index) => (
        <Item
          key={folderName}
          icon={iconSet.Folders}
          label={'/' + pathPieces.slice(0, index + 1).join('/')}
          onClick={goToPath('/' + pathPieces.slice(0, index + 1).join('/'))}
          title={folderName}
          isLast={index === pathPieces.length - 1}
        />
      ))}
    </nav>
  )
}
