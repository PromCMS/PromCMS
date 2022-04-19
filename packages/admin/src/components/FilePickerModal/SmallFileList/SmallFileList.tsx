import { Button } from '@components/Button'
import { iconSet } from '@prom-cms/icons'
import { ItemID } from '@prom-cms/shared'
import { FileService } from '@services'
import { useCallback, useMemo, useState, VFC } from 'react'
import { useDropzone } from 'react-dropzone'
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
  onChange: (newValue: ItemID[]) => void
}

export const SmallFileList: VFC<SmallFileListProps> = ({
  multiple,
  triggerClose,
  pickedFiles,
  onChange,
}) => {
  const [searchBarOpen, setSearchBarOpen] = useState(false)
  const [state, updateValue] = useSmallFileListContextReducer()
  const [currentPage, setCurrentPage] = useState(1)
  const { data, isError, isLoading, mutate } = useFileList({
    page: currentPage,
  })

  const changePage = (mode: 'next' | 'prev') => () => {
    setCurrentPage(mode === 'next' ? currentPage + 1 : currentPage - 1)
  }

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
          {multiple ? 'Select files' : 'Select a file'}
        </h1>
        <div className="flex gap-2">
          <Button
            className="flex-none"
            onClick={() => setSearchBarOpen(!searchBarOpen)}
          >
            <iconSet.Search className="!-mx-2 aspect-square w-8 !fill-transparent" />
          </Button>
          <Button color="success" className="flex-none" onClick={open}>
            <iconSet.Plus className="!-mx-3 aspect-square w-8" />
          </Button>
        </div>
      </div>
      {searchBarOpen && <SearchBar />}
      <hr className="my-5 mb-2 h-0.5 w-full border-none bg-gray-200" />
      <List onDeleteClick={onDeleteClick} />
      <div className="mt-5 flex items-center justify-between">
        {triggerClose && (
          <Button
            onClick={triggerClose}
            disabled={!pickedFiles.length}
            color="success"
          >
            Accept
          </Button>
        )}
        <div className="ml-auto flex items-center">
          <Button
            disabled={currentPage === 1 || isLoading}
            onClick={changePage('prev')}
            className=""
          >
            <iconSet.ChevronLeft className="h-6 w-6 !fill-transparent" />
          </Button>
          <div className="flex items-center justify-center rounded-lg bg-gray-100 py-2 px-4 font-semibold">
            {currentPage}
          </div>
          <Button
            disabled={data?.last_page === currentPage || isLoading}
            onClick={changePage('next')}
          >
            <iconSet.ChevronRight className="h-6 w-6 !fill-transparent" />
          </Button>
        </div>
      </div>
    </SmallFileListContext.Provider>
  )
}
