import { ActionIcon, Button, Pagination } from '@mantine/core'
import { iconSet } from '@prom-cms/icons'
import { ItemID } from '@prom-cms/shared'
import { FileService } from '@services'
import { useCallback, useMemo, useState, VFC } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import { FilePickerModalProps } from '../FilePickerModal'
import {
  ISmallFileListContext,
  SmallFileListContext,
  useSmallFileListContextReducer,
} from './context'
import { List, ListProps } from './List'
import { useFileList } from './List/hooks'
import { SearchBar } from './SearchBar'

export interface SmallFileListProps {
  multiple?: boolean
  triggerClose?: FilePickerModalProps['onClose']
  pickedFiles: ItemID[]
  title?: string
  onChange: (newValue: ItemID[]) => void
  filter?: [field: string, equasion: string, mustBe: string][]
}

export const SmallFileList: VFC<SmallFileListProps> = ({
  title,
  multiple,
  triggerClose,
  pickedFiles,
  onChange,
  filter,
}) => {
  const { t } = useTranslation()
  const [searchBarOpen, setSearchBarOpen] = useState(false)
  const [state, updateValue] = useSmallFileListContextReducer()
  const [page, setPage] = useState(1)
  const { data, isError, isLoading, mutate } = useFileList({
    page,
    ...(filter
      ? Object.fromEntries(
          filter.map(([field, equation, mustBe], index) => [
            `where[${index}]`,
            `["${field}","${equation}","${mustBe}"]`,
          ])
        )
      : {}),
  })

  const onDeleteClick: ListProps['onDeleteClick'] = useCallback((id) => {}, [])
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      updateValue({ name: 'isLoading', value: true })
      await FileService.create(acceptedFiles[0], { root: '/' })
      updateValue({ name: 'isLoading', value: false })
      mutate()
    },
    [updateValue, mutate]
  )

  const { open, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    multiple: false,
  })

  const contextUpdateValue: ISmallFileListContext['updateValue'] = useCallback(
    ({ name, value }) => {
      if (name === 'selectedFiles') {
        const resultValue = pickedFiles.includes(value as ItemID)
          ? pickedFiles.filter((id) => id !== value)
          : multiple
          ? [...pickedFiles, value as ItemID]
          : [value as ItemID]

        onChange(resultValue)
        if (!multiple && triggerClose) triggerClose()
        return
      }

      updateValue({ name, value })
    },
    [updateValue, onChange, triggerClose, multiple, pickedFiles]
  )

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
  )

  return (
    <SmallFileListContext.Provider value={contextValue}>
      <input {...getInputProps({ className: 'hidden' })} />
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold">
          {title || t(multiple ? 'Select files' : 'Select a file')}
        </h1>
        <div className="flex gap-2">
          <ActionIcon
            className="flex-none"
            size={40}
            onClick={() => setSearchBarOpen(!searchBarOpen)}
          >
            <iconSet.Search className="!-mx-2 aspect-square w-8 !fill-transparent" />
          </ActionIcon>
          <ActionIcon
            color="green"
            size={40}
            variant="filled"
            className="flex-none"
            onClick={open}
          >
            <iconSet.Plus className="!-mx-3 aspect-square w-8" />
          </ActionIcon>
        </div>
      </div>
      {searchBarOpen && <SearchBar />}
      <hr className="my-5 mt-0 mb-2 h-0.5 w-full border-none bg-gray-200" />
      <List onDeleteClick={onDeleteClick} />
      <div className="flex items-center justify-between">
        {triggerClose && (
          <Button
            onClick={triggerClose}
            disabled={!pickedFiles.length}
            color="green"
          >
            Accept
          </Button>
        )}
        <Pagination
          total={data?.last_page || 1}
          onChange={setPage}
          className="mx-auto items-center"
        />
      </div>
    </SmallFileListContext.Provider>
  )
}
