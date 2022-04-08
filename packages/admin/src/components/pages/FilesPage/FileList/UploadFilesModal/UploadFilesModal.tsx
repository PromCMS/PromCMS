import Modal, { ModalProps } from '@components/Modal'
import { VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { useFileListContext } from '../context'

export type UploadFilesModalProps = Pick<ModalProps, 'onClose' | 'isOpen'>

export const UploadFilesModal: VFC<UploadFilesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { getDropZoneInputProps, getDropZoneRootProps } = useFileListContext()
  const { t } = useTranslation()

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="normal">
      <div
        {...getDropZoneRootProps({
          className:
            'flex h-full min-h-[750px] w-full rounded-2xl border-4 border-dashed border-blue-300 bg-gray-100',
        })}
      >
        <input {...getDropZoneInputProps({})} />
        <div className="m-auto text-center">
          <p className="text-xl font-semibold text-gray-400">
            {t('Drag your files here here')}
          </p>
        </div>
      </div>
    </Modal>
  )
}
