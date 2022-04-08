import Modal, { ModalProps } from '@components/Modal'
import { FileList } from '@components/pages/FilesPage'
import { VFC } from 'react'

export interface FilePickerModalProps extends ModalProps {
  multiple?: boolean
}

export const FilePickerModal: VFC<FilePickerModalProps> = ({ ...rest }) => {
  return (
    <Modal {...rest}>
      <FileList />
    </Modal>
  )
}
