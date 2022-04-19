import { File, ItemID } from '@prom-cms/shared'
import { useCallback, useMemo, VFC } from 'react'
import { useClassNames as getClassnames } from '../../useClassNames'
import { useSmallFileList } from '../../context'
import { iconSet } from '@prom-cms/icons'
import clsx from 'clsx'
import { FileService } from '@services'

const classNames = getClassnames()

export interface FileItemProps extends File {
  onDeleteClick: (id: ItemID) => void
}

export const FileItem: VFC<FileItemProps> = ({ id, filename }) => {
  const { multiple, selectedFiles, updateValue } = useSmallFileList()
  const extension = filename.split('.').at(-1) || 'unknown'
  const isImage =
    extension.includes('png') ||
    extension.includes('jpg') ||
    extension.includes('gif')

  const onPick = useCallback(() => {
    updateValue({
      name: 'selectedFiles',
      value: id as any,
    })
  }, [id, updateValue])

  const isPicked = useMemo(
    () => selectedFiles.includes(id),
    [selectedFiles, id]
  )

  return (
    <button
      className={clsx(classNames.itemRoot, 'group')}
      onClick={onPick}
      type="button"
    >
      <div className={classNames.itemSquare()}>
        {isImage ? (
          <img
            alt="uploaded file"
            className="absolute top-0 left-0 h-full w-full object-cover"
            src={`/api${FileService.getApiRawUrl(id)}`}
          />
        ) : (
          <div className="flex h-full w-full">
            <p className="m-auto text-3xl font-bold text-gray-400">
              {extension}
            </p>
          </div>
        )}
      </div>
      <h1 className={classNames.itemLabel}>{filename}</h1>
      <div className="absolute top-0 right-0 m-2.5">
        <div
          className={clsx(
            'flex h-10 w-10 rounded-lg border-2 border-project-border bg-white shadow-lg transition-all duration-150',
            isPicked ? 'text-green-600' : 'text-white group-hover:text-blue-200'
          )}
        >
          <iconSet.Check
            className={clsx(
              'm-auto h-8 w-8 !fill-transparent',
              isPicked ? 'scale-100' : 'scale-80 '
            )}
          />
        </div>
      </div>
    </button>
  )
}
