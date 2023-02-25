import { ItemID } from '@prom-cms/shared';
import {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  FC,
  useCallback,
} from 'react';
import { useClassNames as getClassnames } from '../../useClassNames';
import { ActionIcon } from '@mantine/core';
import { Trash } from 'tabler-icons-react';
import { Link } from 'react-router-dom';
import { FileItem as FileItemType } from '@prom-cms/api-client';
import { apiClient } from '@api';
import { pageUrls } from '@constants';

const classNames = getClassnames();

const LinkItem: FC<
  { itemId: ItemID } & Omit<
    DetailedHTMLProps<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >,
    'ref'
  >
> = ({ itemId, children, className, ...rest }) => (
  <Link to={pageUrls.files.view(itemId)} {...rest}>
    {children}
  </Link>
);

export interface FileItemProps extends FileItemType {
  onDeleteClick: (id: ItemID) => void;
}

export const FileItem: FC<FileItemProps> = ({
  id,
  filename,
  mimeType,
  onDeleteClick,
}) => {
  const extension = filename.split('.').at(-1) || 'unknown';
  const type = mimeType?.split('/')?.[0] || 'unknown';
  const isImage = type === 'image';

  const onDelete = useCallback(() => onDeleteClick(id), [id, onDeleteClick]);

  return (
    <article className={classNames.itemRoot}>
      <LinkItem itemId={id}>
        <div className={classNames.itemSquare()}>
          {isImage ? (
            <img
              alt="uploaded file"
              className="absolute top-0 left-0 h-full w-full object-cover rounded-lg"
              src={apiClient.files
                .getAssetUrl(id, { w: '250', q: '60' })
                .toString()}
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
      </LinkItem>
      <div className="absolute top-0 right-0 m-2.5">
        <ActionIcon
          onClick={onDelete}
          size={45}
          color={'red'}
          className="border-2 border-project-border bg-white"
        >
          <Trash size={25} />
        </ActionIcon>
      </div>
    </article>
  );
};
