import { FileList, FileListProps } from '@components/FileList';
import { SlideOver } from '@components/SlideOver';
import { FileItem } from '@prom-cms/api-client';
import { FC, useCallback, useState } from 'react';

export interface FilePickerProps {
  value: FileItem['id'][] | null;
  onChange: (nextValues: FileItem['id'][] | null) => void;
  closeOnPick?: boolean;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  fileQueryParameters?: FileListProps['fileQueryParameters'];
}

/**
 * Wrapper around FileList component that help with managing selecting values and showing list in SlideOver component
 */
export const FilePicker: FC<FilePickerProps> = ({
  onChange,
  value,
  closeOnPick,
  title,
  isOpen: pickerOpen,
  onClose,
  fileQueryParameters,
}) => {
  const [pickerFolderLocation, setFolderLocation] = useState('/');

  const onToggleSelectedFile = useCallback<
    NonNullable<FileListProps['onToggleSelectedFile']>
  >(
    (fileId, shouldBeSelected) => {
      let finalValue: null | string[] = null;

      if (shouldBeSelected) {
        const valueAsArray = value ?? [];

        if (valueAsArray.includes(String(fileId))) {
          finalValue = valueAsArray;
        } else {
          finalValue = [...valueAsArray, String(fileId)];
        }
      } else {
        const nextValue = Array.isArray(value)
          ? value?.filter((currentId) => String(currentId) !== String(fileId))
          : null;

        value = nextValue?.length ? nextValue : null;
      }

      onChange(finalValue);

      if (closeOnPick && finalValue) {
        onClose();
      }
    },
    [onChange, onClose, closeOnPick, value]
  );

  return (
    <SlideOver isOpen={pickerOpen} onClose={onClose}>
      <SlideOver.Title>{title}</SlideOver.Title>
      <SlideOver.Content>
        <FileList
          currentFolder={pickerFolderLocation}
          onFolderChange={setFolderLocation}
          selectedFileIds={value ?? []}
          onToggleSelectedFile={onToggleSelectedFile}
          fileQueryParameters={fileQueryParameters}
        />
      </SlideOver.Content>
    </SlideOver>
  );
};
