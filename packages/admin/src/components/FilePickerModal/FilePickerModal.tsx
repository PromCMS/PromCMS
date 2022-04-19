import Modal, { ModalProps } from '@components/Modal'
import { ItemID } from '@prom-cms/shared'
import { VFC } from 'react'
import { SmallFileList } from './SmallFileList'

export interface FilePickerModalProps extends Omit<ModalProps, 'onClose'> {
  multiple?: boolean
  onClose: () => void
  pickedFiles: ItemID[]
  onChange: (itemId: ItemID[]) => void
}

export const FilePickerModal: VFC<FilePickerModalProps> = ({
  multiple,
  onClose,
  pickedFiles,
  onChange,
  ...rest
}) => {
  return (
    <Modal onClose={onClose} {...rest}>
      <div className="p-5">
        <SmallFileList
          triggerClose={onClose}
          multiple={multiple}
          pickedFiles={pickedFiles}
          onChange={onChange}
        />
      </div>
    </Modal>
  )
}
