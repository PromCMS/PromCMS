import BackendImage from '@components/BackendImage';
import { ActionButton } from '@components/form/editors/_extensions/ActionButton';
import { ActionButtonDivider } from '@components/form/editors/_extensions/ActionButtonDivider';
import { StaticBubbleMenu } from '@components/form/editors/_extensions/StaticBubbleMenu';
import { FilePicker, FilePickerProps } from '@components/form/FilePicker';
import { SIMPLE_WORDS } from '@constants';
import { Button, Popover, TextInput, Textarea, Paper } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';
import { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pencil,
  Settings,
  Trash,
  ArrowsMinimize,
  ArrowsMaximize,
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

  const pickedFiles = useMemo(() => (fileId ? [String(fileId)] : []), [fileId]);
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
          fileId: items?.at(-1) || '',
        });
      }
    },
    [props.updateAttributes]
  );

  return (
    <>
      <NodeViewWrapper>
        <div
          className={clsx(
            'relative aspect-[2/1] w-full rounded-lg bg-white p-5 my-6',
            props.selected ? 'ring-2 ring-blue-500' : 'cursor-pointer'
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
            <div className="absolute top-0 left-0 h-full w-full rounded-lg bg-gray-200 object-cover">
              invalid
            </div>
          )}
        </div>
        <StaticBubbleMenu open={props.selected}>
          <ActionButton
            label={t('Change image')}
            icon={Pencil}
            onClick={open}
          />
          <ActionButtonDivider />
          <ActionButton
            label={t('Fit')}
            icon={ArrowsMinimize}
            active={!metadata?.stretch}
            onClick={() => handleMetadataChange('stretch', false)}
          />
          <ActionButton
            label={t('Stretch')}
            icon={ArrowsMaximize}
            active={metadata?.stretch}
            onClick={() => handleMetadataChange('stretch', true)}
          />
          <ActionButtonDivider />
          <Popover withArrow width={590} position="top" withinPortal={false}>
            <Popover.Target>
              <ActionButton label={t('Change metadata')} icon={Settings} />
            </Popover.Target>
            <Popover.Dropdown>
              <TextInput
                label={t('Label')}
                value={metadata?.label || ''}
                placeholder={t('Some text')}
                onChange={(event) =>
                  handleMetadataChange('label', event.target.value)
                }
              />
              <Textarea
                label={t('Description')}
                mt="sm"
                value={metadata?.description || ''}
                placeholder={t('Some text')}
                onChange={(event) =>
                  handleMetadataChange('description', event.target.value)
                }
              />
              <Button className="mt-5">Ok</Button>
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
        title={t('Choose an image')}
        fileQueryParameters={{
          where: { mimeType: { manipulator: 'LIKE', value: '%image%' } },
        }}
      />
    </>
  );
};
