import { ItemID } from '@prom-cms/shared';
import { useCallback, useMemo, FC } from 'react';
import { useClassNames as getClassnames } from '../../useClassNames';
import { useSmallFileList } from '../../context';
import clsx from 'clsx';
import { BackgroundImage, Tooltip, UnstyledButton } from '@mantine/core';
import BackendImage, { getImageSrc } from '@components/BackendImage';
import { Check } from 'tabler-icons-react';
import { FileItem as FileItemType } from '@prom-cms/api-client';

const classNames = getClassnames();

export interface FileItemProps extends FileItemType {
  onDeleteClick: (id: ItemID) => void;
}

export const FileItem: FC<FileItemProps> = ({ id, filename, mimeType }) => {
  const { selectedFiles, updateValue } = useSmallFileList();
  const extension = filename.split('.').at(-1) || 'unknown';
  const type = mimeType?.split('/')?.[0] || 'unknown';
  const isImage = type === 'image';

  const onPick = useCallback(() => {
    updateValue({
      name: 'selectedFiles',
      value: id as any,
    });
  }, [id, updateValue]);

  const isPicked = useMemo(
    () => selectedFiles.includes(id),
    [selectedFiles, id]
  );

  return (
    <UnstyledButton
      className={clsx(classNames.itemRoot, 'group')}
      onClick={onPick}
      type="button"
      title={filename}
    >
      <div className={classNames.itemSquare()}>
        {isImage ? (
          <Tooltip.Floating
            sx={{ padding: 0 }}
            label={
              <BackendImage
                radius="md"
                width={250}
                imageId={id}
                alt="Preview of image"
                className="shadow-md"
              />
            }
          >
            <BackgroundImage h="100%" src={getImageSrc(id)!} />
          </Tooltip.Floating>
        ) : (
          <div className="flex h-full w-full">
            <p className="m-auto text-3xl font-bold text-gray-400 no-underline">
              {extension}
            </p>
          </div>
        )}
      </div>
      <h3 className={classNames.itemLabel}>{filename}</h3>
      <div className="absolute top-0 right-0 m-2.5">
        <div
          className={clsx([
            'flex h-10 w-10 rounded-lg border-2 border-project-border bg-white shadow-lg transition-all duration-150 items-center justify-center',
            '[&>svg]:m-auto [&>svg]:h-8 [&>svg]:w-8 ![&>svg]:fill-transparent',
            isPicked
              ? 'text-green-600'
              : 'text-white group-hover:text-blue-200',
            isPicked ? '[&>svg]:scale-100' : '[&>svg]:scale-80',
          ])}
        >
          <Check />
        </div>
      </div>
    </UnstyledButton>
  );
};
