import {
  AnchorHTMLAttributes,
  ChangeEventHandler,
  DetailedHTMLProps,
  FC,
  MouseEventHandler,
  useCallback,
  useRef,
} from 'react';
import { useClassNames as getClassnames } from '../../useClassNames';
import { ActionIcon, Checkbox } from '@mantine/core';
import { Trash } from 'tabler-icons-react';
import { FileItem as FileItemType, ItemID } from '@prom-cms/api-client';
import { apiClient } from '@api';
import { pageUrls } from '@constants';
import { IFileListContext } from '@components/FileList/context';

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
  <a href={`/admin${pageUrls.files.view(itemId)}`} {...rest}>
    {children}
  </a>
);

export interface FileItemProps extends FileItemType {
  onDeleteClick: (id: ItemID) => void;
  onTogglePick?: IFileListContext['onToggleSelectedFile'];
  isPicked?: boolean;
}

export const FileItem: FC<FileItemProps> = ({
  onDeleteClick,
  onTogglePick,
  isPicked,
  ...fileInfo
}) => {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const extension = fileInfo.filename.split('.').at(-1) || 'unknown';
  const type = fileInfo.mimeType?.split('/')?.[0] || 'unknown';
  const isImage = type === 'image';

  const handleDelete = useCallback(() => {
    onDeleteClick(fileInfo.id);

    if (onTogglePick) {
      onTogglePick(fileInfo.id, false);
    }
  }, [fileInfo.id, onDeleteClick, onTogglePick]);

  const handlePick = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) =>
      onTogglePick
        ? onTogglePick(fileInfo.id, event.currentTarget.checked)
        : null,
    [fileInfo.id, onTogglePick]
  );

  const handleClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    (event) => {
      if (onTogglePick) {
        event.preventDefault();
        checkboxRef.current?.click();
      }
    },
    [onTogglePick]
  );

  return (
    <article className={classNames.itemRoot}>
      <LinkItem onClick={handleClick} itemId={fileInfo.id}>
        <div className={classNames.itemSquare()}>
          {isImage ? (
            <img
              alt="uploaded file"
              className="absolute top-0 left-0 h-full w-full object-cover"
              src={apiClient.files
                .getAssetUrl(fileInfo.id, { w: '250', q: '60' })
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
        <h3 className={classNames.itemLabel}>{fileInfo.filename}</h3>
      </LinkItem>
      <div className="absolute top-0 right-0 m-2.5 flex gap-2">
        {onTogglePick ? (
          <Checkbox
            ref={checkboxRef}
            checked={isPicked}
            onChange={handlePick}
            color="blue"
            size="xl"
            className="flex-none cursor-pointer"
          />
        ) : null}
        <ActionIcon
          onClick={handleDelete}
          size={36}
          color="red"
          className="border-2 border-project-border bg-white flex-none"
        >
          <Trash size={20} />
        </ActionIcon>
      </div>
    </article>
  );
};
