import { apiClient } from '@api';
import { WhereQueryParam } from '@custom-types';
import { ActionIcon, Button, Pagination } from '@mantine/core';
import { ItemID } from '@prom-cms/shared';
import { useCallback, useMemo, useState, VFC } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Plus } from 'tabler-icons-react';
import { FilePickerModalProps } from '../FilePickerModal';
import {
  ISmallFileListContext,
  SmallFileListContext,
  useSmallFileListContextReducer,
} from './context';
import { List, ListProps } from './List';
import { useFileList } from './List/hooks';
import { SearchBar } from './SearchBar';

export interface SmallFileListProps {
  multiple?: boolean;
  triggerClose?: FilePickerModalProps['onClose'];
  pickedFiles: ItemID[];
  title?: string;
  onChange: (newValue: ItemID[]) => void;
  where?: WhereQueryParam;
}

export const SmallFileList: VFC<SmallFileListProps> = ({
  title,
  multiple,
  triggerClose,
  pickedFiles,
  onChange,
  where,
}) => {
  const { t } = useTranslation();
  const [state, updateValue] = useSmallFileListContextReducer();
  const [page, setPage] = useState(1);
  const {
    data,
    isError,
    isLoading,
    refetch: mutate,
  } = useFileList({
    page,
    where: {
      ...(state.searchValue
        ? {
            filename: {
              manipulator: 'LIKE',
              value: `%${state.searchValue}%`,
            },
          }
        : {}),
      ...(where ?? {}),
    },
  });

  const onDeleteClick: ListProps['onDeleteClick'] = useCallback((id) => {}, []);
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      updateValue({ name: 'isLoading', value: true });
      await apiClient.files.create(acceptedFiles[0], {
        root: '/',
      });
      updateValue({ name: 'isLoading', value: false });
      mutate();
    },
    [updateValue, mutate]
  );

  const { open, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    multiple: false,
  });

  const contextUpdateValue: ISmallFileListContext['updateValue'] = useCallback(
    ({ name, value }) => {
      if (name === 'selectedFiles') {
        const resultValue = pickedFiles.includes(value as ItemID)
          ? pickedFiles.filter((id) => id !== value)
          : multiple
          ? [...pickedFiles, value as ItemID]
          : [value as ItemID];

        onChange(resultValue);
        if (!multiple && triggerClose) triggerClose();
        return;
      }

      updateValue({ name, value });
    },
    [updateValue, onChange, triggerClose, multiple, pickedFiles]
  );

  const contextValue = useMemo(
    () => ({
      ...state,
      multiple: !!multiple,
      files: data?.data || [],
      isLoading: isLoading || isError,
      selectedFiles: pickedFiles,
      updateValue: contextUpdateValue,
    }),
    [state, data, isLoading, isError, contextUpdateValue, multiple, pickedFiles]
  );

  return (
    <SmallFileListContext.Provider value={contextValue}>
      <input {...getInputProps({ className: 'hidden' })} />
      <div className="flex items-center justify-between">
        <SearchBar />
        <ActionIcon
          color="blue"
          size={42}
          variant="filled"
          className="flex-none ![&>svg]:-mx-3 [&>svg]:aspect-square [&>svg]:w-6"
          title={t('Add new')}
          ml="xl"
          onClick={open}
        >
          <Plus />
        </ActionIcon>
      </div>
      <List onDeleteClick={onDeleteClick} />
      <div className="flex items-center justify-between">
        <Pagination
          total={data?.last_page || 1}
          onChange={setPage}
          className="items-center"
        />
        <div className="flex items-center gap-2">
          {triggerClose && (
            <Button
              onClick={triggerClose}
              disabled={!pickedFiles.length}
              size="md"
              color="green"
              ml="xl"
            >
              Accept
            </Button>
          )}
        </div>
      </div>
    </SmallFileListContext.Provider>
  );
};
