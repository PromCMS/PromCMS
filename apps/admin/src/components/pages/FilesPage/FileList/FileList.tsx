import { useCallback, useState, VFC } from 'react'
import { Menu } from './Menu'
import { FileListContextProvider } from './context'
import { UploadFilesModal } from './UploadFilesModal'
import { List } from './List'

export const FileList: VFC = () => {
  const [uploadFileModalOpen, setUploadFileModalOpen] = useState<boolean>(false)

  const onDragOver = useCallback(
    (event) => {
      event.preventDefault()
      if (
        !uploadFileModalOpen &&
        (event?.dataTransfer?.types || []).join('') === 'Files'
      ) {
        setUploadFileModalOpen(true)
      }
    },
    [uploadFileModalOpen, setUploadFileModalOpen]
  )

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()
      if (uploadFileModalOpen) {
        setUploadFileModalOpen(false)
      }
    },
    [uploadFileModalOpen, setUploadFileModalOpen]
  )

  const closeModal = useCallback(
    () => setUploadFileModalOpen(false),
    [setUploadFileModalOpen]
  )

  return (
    <FileListContextProvider>
      <div onDragOver={onDragOver} onDrop={onDrop}>
        <Menu />
        <List />
        <UploadFilesModal isOpen={uploadFileModalOpen} onClose={closeModal} />
      </div>
    </FileListContextProvider>
  )
}
