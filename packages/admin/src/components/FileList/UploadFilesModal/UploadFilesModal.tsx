import { MESSAGES } from '@constants';
import { Modal, ModalProps } from '@mantine/core';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useFileListContext } from '../context';

export type UploadFilesModalProps = Pick<ModalProps, 'onClose'> & {
  isOpen: boolean;
};

export const UploadFilesModal: FC<UploadFilesModalProps> = ({
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
            {t(MESSAGES.DRAG_FILES_HERE)}
          </p>
        </div>
      </div>
    </Modal>
  );
};
