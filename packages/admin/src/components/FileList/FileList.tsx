import { FC, useCallback, useState } from 'react';

import { List } from './List';
import { Menu } from './Menu';
import { UploadFilesModal } from './UploadFilesModal';
import { FileListContextProvider, FileListProviderProps } from './context';

export type FileListProps = FileListProviderProps;

export const FileList: FC<FileListProps> = ({
  currentFolder,
  onFolderChange,
  selectedFileIds,
  onToggleSelectedFile,
  fileQueryParameters,
}) => {
  const [uploadFileModalOpen, setUploadFileModalOpen] =
    useState<boolean>(false);

  const onDragOver = useCallback(
    (event) => {
      event.preventDefault();
      if (
        !uploadFileModalOpen &&
        (event?.dataTransfer?.types || []).join('') === 'Files'
      ) {
        setUploadFileModalOpen(true);
      }
    },
    [uploadFileModalOpen, setUploadFileModalOpen]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (uploadFileModalOpen) {
        setUploadFileModalOpen(false);
      }
    },
    [uploadFileModalOpen, setUploadFileModalOpen]
  );

  const closeModal = useCallback(
    () => setUploadFileModalOpen(false),
    [setUploadFileModalOpen]
  );

  return (
    <FileListContextProvider
      currentFolder={currentFolder}
      onFolderChange={onFolderChange}
      selectedFileIds={selectedFileIds}
      onToggleSelectedFile={onToggleSelectedFile}
      fileQueryParameters={fileQueryParameters}
    >
      <div onDragOver={onDragOver} onDrop={onDrop}>
        <Menu />
        <List />
        <UploadFilesModal isOpen={uploadFileModalOpen} onClose={closeModal} />
      </div>
    </FileListContextProvider>
  );
};
