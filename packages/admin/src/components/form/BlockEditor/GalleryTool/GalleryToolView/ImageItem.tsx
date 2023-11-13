import BackendImage from '@components/BackendImage';
import {
  ActionIcon,
  Button,
  Popover,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useState } from 'react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Trash } from 'tabler-icons-react';
import { ImageInfo } from '../GalleryTool';
import { useGalleryToolViewContext } from './context';

export const ImageItem: FC<ImageInfo> = ({ id, description, title }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { readOnly, removeFile, changeMetadata } = useGalleryToolViewContext();
  const { t } = useTranslation();

  return (
    <div className="relative aspect-square w-full">
      <BackendImage
        imageId={id}
        width={290}
        quality={60}
        className="absolute top-0 left-0 h-full w-full overflow-hidden rounded-xl object-contain object-center"
      />
      {!readOnly && (
        <div className="absolute right-0 bottom-0 m-3 flex gap-3">
          <Popover
            withArrow
            opened={popoverOpen}
            onClose={() => setPopoverOpen(false)}
            withinPortal={false}
            width={590}
            position="top"
          >
            <Popover.Target>
              <ActionIcon
                size="xl"
                color="blue"
                variant="filled"
                title={t('Select new image')}
                className="aspect-square w-full"
                onClick={() => setPopoverOpen((s) => !s)}
              >
                <Settings size={30} />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <TextInput
                label={t('Title')}
                value={title || ''}
                placeholder={t('Some text')}
                onChange={(e) =>
                  changeMetadata('title', id, e.currentTarget.value)
                }
              />
              <Textarea
                label={t('Description')}
                mt="sm"
                value={description || ''}
                placeholder={t('Some text')}
                onChange={(e) =>
                  changeMetadata('description', id, e.currentTarget.value)
                }
              />
              <Button onClick={() => setPopoverOpen(false)} className="mt-5">
                Ok
              </Button>
            </Popover.Dropdown>
          </Popover>
          <ActionIcon
            size="xl"
            color="red"
            variant="filled"
            onClick={() => removeFile(id)}
          >
            <Trash size={30} />
          </ActionIcon>
        </div>
      )}
    </div>
  );
};
