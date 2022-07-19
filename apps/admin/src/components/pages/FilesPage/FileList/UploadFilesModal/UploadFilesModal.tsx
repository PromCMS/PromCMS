import { Modal, ModalProps } from '@mantine/core';
import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { useFileListContext } from '../context';

export type UploadFilesModalProps = Pick<ModalProps, 'onClose'> & {
  isOpen: boolean;
};

export const UploadFilesModal: VFC<UploadFilesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { getDropZoneRootProps } = useFileListContext();
  const { t } = useTranslation();

  return (
    <Modal opened={isOpen} onClose={onClose}>
      <div
        {...getDropZoneRootProps({
          className:
            'flex h-full min-h-[750px] w-full rounded-2xl border-4 border-dashed border-blue-300 bg-gray-100',
        })}
      >
        <div className="m-auto text-center">
          <p className="text-xl font-semibold text-gray-400">
            {t('Drag your files here here')}
          </p>
        </div>
      </div>
    </Modal>
  );
};
