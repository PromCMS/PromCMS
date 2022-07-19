import ItemsMissingMessage from '@components/ItemsMissingMessage';
import { VFC } from 'react';
import { useSmallFileList } from '../context';
import { useClassNames } from '../useClassNames';
import { FileItem, FileItemProps, FileItemSkeleton } from './FileItem';

export interface ListProps {
  onDeleteClick: FileItemProps['onDeleteClick'];
}

export const List: VFC<ListProps> = ({ onDeleteClick }) => {
  const classNames = useClassNames();
  const { files, isLoading, isUploading } = useSmallFileList();

  return (
    <div className={classNames.itemsWrap}>
      {!isLoading ? (
        files.length ? (
          files.map((file) => (
            <FileItem key={file.id} onDeleteClick={onDeleteClick} {...file} />
          ))
        ) : (
          <ItemsMissingMessage className="col-span-1 sm:col-span-2 md:col-span-4" />
        )
      ) : (
        <>
          <FileItemSkeleton />
          <FileItemSkeleton />
          <FileItemSkeleton />
          <FileItemSkeleton />
          <FileItemSkeleton />
          <FileItemSkeleton />
        </>
      )}
      {isUploading && <FileItemSkeleton />}
    </div>
  );
};
