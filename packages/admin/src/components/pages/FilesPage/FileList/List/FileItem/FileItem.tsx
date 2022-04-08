import { File, ItemID } from '@prom-cms/shared'
import {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  FC,
  useCallback,
  VFC,
} from 'react'
import Link from 'next/link'
import { FileService } from '@services'
import { useClassNames as getClassnames } from '../../useClassNames'
import IconButton from '@components/IconButton'
import { TrashIcon } from '@heroicons/react/outline'

const classNames = getClassnames()

const LinkItem: FC<
  { itemId: ItemID } & DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
> = ({ itemId, children, className, ...rest }) => (
  <Link href={FileService.getUrl(itemId)}>
    <a {...rest}>{children}</a>
  </Link>
)

export interface FileItemProps extends File {
  onDeleteClick: (id: ItemID) => void
}

export const FileItem: VFC<FileItemProps> = ({
  id,
  filename,
  onDeleteClick,
}) => {
  const extension = filename.split('.').at(-1) || 'unknown'
  const isImage =
    extension.includes('png') ||
    extension.includes('jpg') ||
    extension.includes('gif')

  const onDelete = useCallback(() => onDeleteClick(id), [id, onDeleteClick])

  return (
    <article className={classNames.itemRoot}>
      <LinkItem itemId={id}>
        <div className={classNames.itemSquare()}>
          {isImage ? (
            <img
              alt="uploaded file"
              className="absolute top-0 left-0 h-full w-full object-cover"
              src={`/api/entry-types/files/items/${id}`}
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
      </LinkItem>
      <div className="absolute top-0 right-0 m-2.5">
        <IconButton
          icon={TrashIcon}
          onClick={onDelete}
          className="border-2 border-project-border shadow-lg duration-200 hover:border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
        />
      </div>
    </article>
  )
}
