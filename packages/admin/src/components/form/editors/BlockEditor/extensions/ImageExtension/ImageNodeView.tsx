import BackendImage from '@components/BackendImage';
import { FilePicker, FilePickerProps } from '@components/form/FilePicker';
import { ActionButton } from '@components/form/editors/_extensions/ActionButton';
import { ActionButtonDivider } from '@components/form/editors/_extensions/ActionButtonDivider';
import { StaticBubbleMenu } from '@components/form/editors/_extensions/StaticBubbleMenu';
import { MESSAGES, SIMPLE_WORDS } from '@constants';
import { Button, Popover, TextInput, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';
import { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowsMaximize,
  ArrowsMinimize,
  Pencil,
  Settings,
  Trash,
} from 'tabler-icons-react';

import { NodeAttrs } from './_types';

export const ImageNodeView: FC<
  NodeViewProps & {
    node: { attrs: NodeAttrs };
  }
> = (props) => {
  const [pickerOpen, { close, open }] = useDisclosure();
  const { t } = useTranslation();
  const { fileId, metadata } = props.node.attrs;

  const pickedFiles = useMemo(() => (fileId ? [{ id: fileId }] : []), [fileId]);
  const handleMetadataChange = (
    metadataKey: keyof NonNullable<NodeAttrs['metadata']>,
    metadataValue: any
  ) => {
    props.updateAttributes({
      metadata: {
        ...metadata,
        [metadataKey]: metadataValue,
      },
    });
  };

  const handleImagesChange = useCallback<FilePickerProps['onChange']>(
    (items) => {
      if (items) {
        props.updateAttributes({
          fileId: items?.at(-1)?.id || '',
        });
      }
    },
    [props.updateAttributes]
  );

  return (
    <>
      <NodeViewWrapper className="my-6">
        <div
          className={clsx(
            'relative aspect-[2/1] w-full rounded-lg bg-white dark:bg-transparent backdrop-blur-md p-5 border-2 border-blue-200 border-dashed',
            props.selected ? '' : 'cursor-pointer'
          )}
        >
          {fileId ? (
            <BackendImage
              width={1000}
              imageId={fileId}
              className={clsx(
                'absolute top-0 left-0 h-full w-full rounded-lg',
                metadata?.stretch ? 'object-cover' : 'object-contain'
              )}
            />
          ) : (
            <div className="absolute top-0 left-0 h-full w-full rounded-lg backdrop-blur-md object-cover"></div>
          )}
        </div>
        <StaticBubbleMenu open={props.selected}>
          <ActionButton
            label={t(MESSAGES.CHANGE_IMAGE)}
            icon={Pencil}
            onClick={open}
          />
          <ActionButtonDivider />
          <ActionButton
            label={t(MESSAGES.FIT_TO_CONTENT)}
            icon={ArrowsMinimize}
            active={!metadata?.stretch}
            onClick={() => handleMetadataChange('stretch', false)}
          />
          <ActionButton
            label={t(MESSAGES.STRETCH_TO_PARENT)}
            icon={ArrowsMaximize}
            active={metadata?.stretch}
            onClick={() => handleMetadataChange('stretch', true)}
          />
          <ActionButtonDivider />
          <Popover withArrow width={590} position="top" withinPortal={false}>
            <Popover.Target>
              <ActionButton
                label={t(MESSAGES.CHANGE_METADATA)}
                icon={Settings}
              />
            </Popover.Target>
            <Popover.Dropdown>
              <TextInput
                label={t(MESSAGES.LABEL)}
                value={metadata?.label || ''}
                placeholder={t(MESSAGES.TEXT_PLACEHOLDER_GENERIC)}
                onChange={(event) =>
                  handleMetadataChange('label', event.target.value)
                }
              />
              <Textarea
                label={t(MESSAGES.DESCRIPTION)}
                mt="sm"
                value={metadata?.description || ''}
                placeholder={t(MESSAGES.DESCRIPTION_PLACEHOLDER)}
                onChange={(event) =>
                  handleMetadataChange('description', event.target.value)
                }
              />
              <Button className="mt-5">OK</Button>
            </Popover.Dropdown>
          </Popover>
          <ActionButtonDivider />
          <ActionButton
            active
            label={t(SIMPLE_WORDS.DELETE)}
            icon={Trash}
            onClick={() => {
              props.deleteNode();
            }}
          />
        </StaticBubbleMenu>
      </NodeViewWrapper>
      <FilePicker
        closeOnPick
        isOpen={pickerOpen}
        onChange={handleImagesChange}
        onClose={close}
        value={pickedFiles}
        title={t(MESSAGES.CHOOSE_IMAGE)}
        fileQueryParameters={{
          where: { mimeType: { manipulator: 'LIKE', value: '%image%' } },
        }}
      />
    </>
  );
};
