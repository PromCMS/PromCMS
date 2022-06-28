import { File, ItemID } from '@prom-cms/shared'
import { useCallback, useMemo, VFC } from 'react'
import { useClassNames as getClassnames } from '../../useClassNames'
import { useSmallFileList } from '../../context'
import { iconSet } from '@prom-cms/icons'
import clsx from 'clsx'
import { FileService } from '@services'
import { UnstyledButton } from '@mantine/core'
import BackendImage from '@components/BackendImage'

const classNames = getClassnames()

export interface FileItemProps extends File {
  onDeleteClick: (id: ItemID) => void
}

export const FileItem: VFC<FileItemProps> = ({ id, filename, mimeType }) => {
  const { selectedFiles, updateValue } = useSmallFileList()
  const extension = filename.split('.').at(-1) || 'unknown'
  const type = mimeType?.split('/')?.[0] || 'unknown'
  const isImage = type === 'image'

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
    <UnstyledButton
      className={clsx(classNames.itemRoot, 'group')}
      onClick={onPick}
      type="button"
      title={filename}
    >
      <div className={classNames.itemSquare()}>
        {isImage ? (
          <BackendImage
            alt="uploaded file"
            imageId={id}
            className="absolute top-0 left-0 h-full w-full object-cover"
            width={270}
          />
        ) : (
          <div className="flex h-full w-full">
            <p className="m-auto text-3xl font-bold text-gray-400">
              {extension}
            </p>
          </div>
        )}
      </div>
      <h3 className={classNames.itemLabel}>{filename}</h3>
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
    </UnstyledButton>
  )
}
