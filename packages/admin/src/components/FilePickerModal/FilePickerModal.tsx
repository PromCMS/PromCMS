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
  where?: SmallFileListProps['where']
}

export const FilePickerModal: VFC<FilePickerModalProps> = ({
  multiple,
  onClose,
  pickedFiles,
  onChange,
  title,
  where,
  ...rest
}) => {
  return (
    <Modal onClose={onClose} title={title} {...rest}>
      <SmallFileList
        where={where}
        title={title}
        triggerClose={onClose}
        multiple={multiple}
        pickedFiles={pickedFiles}
        onChange={onChange}
      />
    </Modal>
  )
}
