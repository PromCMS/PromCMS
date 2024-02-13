import { FilePicker, FilePickerProps } from '@components/form/FilePicker';
import { ActionButton } from '@components/form/editors/_extensions/ActionButton';
import { ActionButtonDivider } from '@components/form/editors/_extensions/ActionButtonDivider';
import { StaticBubbleMenu } from '@components/form/editors/_extensions/StaticBubbleMenu';
import { MESSAGES, SIMPLE_WORDS } from '@constants';
import { Button, Popover } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';
import { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BoxMultiple3,
  BoxMultiple4,
  BoxMultiple5,
  BoxMultiple6,
  Icon,
  Layout,
  Plus,
  Trash,
} from 'tabler-icons-react';

import { ImageAlbumItemAttrs } from '../_types';
import { ImageAlbumItem, ImageAlbumItemProps } from './ImageAlbumItem';

const ALLOWED_NUMBER_OF_COLUMNS = [3, 4, 5, 6] as const;
const NUMBER_OF_COLUMNS_TO_ICON: Record<
  (typeof ALLOWED_NUMBER_OF_COLUMNS)[number],
  Icon
> = {
  '3': BoxMultiple3,
  '4': BoxMultiple4,
  '5': BoxMultiple5,
  '6': BoxMultiple6,
};

export const ImageAlbumNodeView: FC<
  NodeViewProps & {
    node: { attrs: { images: ImageAlbumItemAttrs[]; numberOfColumns: number } };
  }
> = (props) => {
  const { t } = useTranslation();
  const [pickerOpen, togglePickerOpen] = useToggle();
  const pickedImages = props.node.attrs.images;
  const numberOfColumns = props.node.attrs.numberOfColumns;
  const pickedImagesAsIds = useMemo(
    () => pickedImages?.map(({ id }) => String(id)) || [],
    [pickedImages]
  );

  const handleImagesChange = useCallback<FilePickerProps['onChange']>(
    (items) => {
      const newImagesState: typeof pickedImages = [];

      if (items) {
        for (const itemId of items) {
          const existingItem = pickedImages.find(
            ({ id }) => itemId === String(id)
          );

          newImagesState.push(
            existingItem || {
              id: itemId,
            }
          );
        }
      }

      props.updateAttributes({
        images: newImagesState,
      });
    },
    [props.updateAttributes, pickedImages]
  );

  const handleImageUnselect = useCallback<
    ImageAlbumItemProps['onRequestUnselect']
  >(
    (itemToRemoveAsId) => {
      props.updateAttributes({
        images: pickedImages.filter(
          ({ id }) => String(id) !== String(itemToRemoveAsId)
        ),
      });
    },
    [props.updateAttributes, pickedImages]
  );

  const divider = <ActionButtonDivider />;

  const handleImageMetadataChange = useCallback<
    ImageAlbumItemProps['onMetadataUpdate']
  >(
    (itemId, metadataInfo) => {
      const newImages = [...pickedImages].map((item) => ({ ...item }));
      const foundPickedImageById = newImages.find(
        ({ id }) => String(itemId) === String(id)
      );

      if (!foundPickedImageById) {
        return;
      }

      if (!foundPickedImageById.metadata) {
        foundPickedImageById.metadata = {};
      }

      foundPickedImageById.metadata = {
        ...foundPickedImageById.metadata,
        [metadataInfo.key]: metadataInfo.value,
      };

      props.updateAttributes({
        images: newImages,
      });
    },
    [props.updateAttributes, pickedImages]
  );

  return (
    <NodeViewWrapper>
      <div
        className={clsx(
          `grid grid-cols-1 gap-3 sm:grid-cols-${numberOfColumns} my-6`
        )}
      >
        {pickedImages.map((props) => (
          <ImageAlbumItem
            key={props.id}
            onMetadataUpdate={handleImageMetadataChange}
            onRequestUnselect={handleImageUnselect}
            {...props}
          />
        ))}
        <Button
          variant="light"
          title={t('Select new image')}
          className="flex aspect-square h-full w-full items-center border-dashed border-2 border-blue-200 justify-center dark:bg-transparent backdrop-blur-md active:outline-none"
          onClick={() => togglePickerOpen()}
        >
          <Plus size={50} className="text-blue-400" />
        </Button>

        <FilePicker
          fileQueryParameters={{
            where: { mimeType: { manipulator: 'LIKE', value: '%image%' } },
          }}
          value={pickedImagesAsIds}
          onChange={handleImagesChange}
          onClose={togglePickerOpen}
          isOpen={pickerOpen}
          title={t(MESSAGES.SELECT)}
        />
      </div>
      <StaticBubbleMenu open={props.selected}>
        <Popover withArrow offset={4} position="top">
          <Popover.Target>
            <ActionButton icon={Layout} label={''} />
          </Popover.Target>
          <Popover.Dropdown p="0.3rem" className="flex flex-row gap-1">
            {ALLOWED_NUMBER_OF_COLUMNS.map((columnCount) => (
              <ActionButton
                key={columnCount}
                onClick={() =>
                  props.editor.commands.setAlbumColumns(columnCount)
                }
                active={columnCount === numberOfColumns}
                icon={NUMBER_OF_COLUMNS_TO_ICON[String(columnCount)]}
                // TODO Add label
                label={''}
              />
            ))}
          </Popover.Dropdown>
        </Popover>
        {divider}
        <ActionButton
          active
          label={t(SIMPLE_WORDS.DELETE)}
          icon={Trash}
          onClick={props.deleteNode}
        />
      </StaticBubbleMenu>
    </NodeViewWrapper>
  );
};
