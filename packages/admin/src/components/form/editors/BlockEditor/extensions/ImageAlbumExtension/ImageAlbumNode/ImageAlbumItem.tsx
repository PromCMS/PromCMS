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
import { ImageAlbumItemAttrs } from '../_types';

export type ImageAlbumItemProps = ImageAlbumItemAttrs & {
  onRequestUnselect: (itemId: ImageAlbumItemAttrs['id']) => void;
  onMetadataUpdate: (
    itemId: ImageAlbumItemAttrs['id'],
    metadata: {
      key: keyof NonNullable<ImageAlbumItemAttrs['metadata']>;
      value: any;
    }
  ) => void;
};

export const ImageAlbumItem: FC<ImageAlbumItemProps> = ({
  id,
  metadata,
  onMetadataUpdate,
  onRequestUnselect,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="relative aspect-square w-full">
      <BackendImage
        imageId={id}
        width={290}
        quality={60}
        className="absolute top-0 left-0 h-full w-full overflow-hidden rounded-md object-cover object-center"
      />
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
              value={metadata?.title || ''}
              placeholder={t('Some text')}
              onChange={(e) =>
                onMetadataUpdate(id, {
                  key: 'title',
                  value: e.currentTarget.value,
                })
              }
            />
            <Textarea
              label={t('Description')}
              mt="sm"
              value={metadata?.description || ''}
              placeholder={t('Some text')}
              onChange={(e) =>
                onMetadataUpdate(id, {
                  key: 'description',
                  value: e.currentTarget.value,
                })
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
          onClick={() => onRequestUnselect(id)}
        >
          <Trash size={30} />
        </ActionIcon>
      </div>
    </div>
  );
};
