import { Modal, ModalProps } from '@mantine/core'
import { ItemID } from '@prom-cms/shared'
import { VFC } from 'react'
import { SmallFileList, SmallFileListProps } from './SmallFileList'

export interface FilePickerModalProps
  extends Omit<ModalProps, 'onClose' | 'onChange'> {
  multiple?: boolean
  onClose: () => void
  pickedFiles: ItemID[]
  onChange: (itemId: ItemID[]) => void
  title?: SmallFileListProps['title']
  filter?: SmallFileListProps['filter']
}

export const FilePickerModal: VFC<FilePickerModalProps> = ({
  multiple,
  onClose,
  pickedFiles,
  onChange,
  title,
  filter,
  ...rest
}) => {
  return (
    <Modal onClose={onClose} title={title} {...rest}>
      <SmallFileList
        filter={filter}
        title={title}
        triggerClose={onClose}
        multiple={multiple}
        pickedFiles={pickedFiles}
        onChange={onChange}
      />
    </Modal>
  )
}
