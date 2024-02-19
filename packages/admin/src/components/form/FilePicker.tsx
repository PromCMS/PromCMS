import { FileList, FileListProps } from '@components/FileList';
import { SlideOver } from '@components/SlideOver';
import { FC, useCallback, useState } from 'react';
import { EntityLink } from 'types/EntityLink';

import { FileItem } from '@prom-cms/api-client';

export interface FilePickerProps {
  value: EntityLink<FileItem>[] | null;
  onChange: (nextValues: EntityLink<FileItem>[] | null) => void;
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
    (file, shouldBeSelected) => {
      let finalValue: FilePickerProps['value'] = null;

      if (shouldBeSelected) {
        const valueAsArray = value ?? [];

        if (valueAsArray.find((value) => value.id === file.id)) {
          finalValue = valueAsArray;
        } else {
          finalValue = [...valueAsArray, { id: file.id }];
        }
      } else {
        const nextValue = Array.isArray(value)
          ? value?.filter((current) => String(current.id) !== String(file.id))
          : null;

        finalValue = nextValue?.length ? nextValue : null;
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
