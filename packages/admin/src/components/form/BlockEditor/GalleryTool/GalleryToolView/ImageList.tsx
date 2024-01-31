import { FilePicker } from '@components/form/FilePicker';
import { MESSAGES } from '@constants';
import { Button } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { useMemo } from 'react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'tabler-icons-react';

import { ImageItem } from './ImageItem';
import { useGalleryToolViewContext } from './context';

export const ImageList: FC = () => {
  const { t } = useTranslation();
  const [pickerOpen, togglePickerOpen] = useToggle();
  const { fileIds, setFiles, readOnly } = useGalleryToolViewContext();
  const pickedFileIds = useMemo(
    () => fileIds?.map(({ id }) => String(id)) || [],
    [fileIds]
  );

  return (
    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {fileIds?.map((props) => <ImageItem key={props.id} {...props} />)}
      {!readOnly && (
        <>
          <Button
            size="lg"
            variant="light"
            title={t('Select new image')}
            className="flex aspect-square h-full w-full items-center justify-center"
            onClick={() => togglePickerOpen()}
          >
            <Plus size={50} />
          </Button>

          <FilePicker
            fileQueryParameters={{
              where: { mimeType: { manipulator: 'LIKE', value: '%image%' } },
            }}
            value={pickedFileIds}
            onChange={setFiles}
            onClose={togglePickerOpen}
            isOpen={pickerOpen}
            title={t(MESSAGES.SELECT)}
          />
        </>
      )}
    </div>
  );
};
