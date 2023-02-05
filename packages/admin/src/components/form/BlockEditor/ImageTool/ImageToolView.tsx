import BackendImage from '@components/BackendImage';
import {
  SmallFileList,
  SmallFileListProps,
} from '@components/FilePickerModal/SmallFileList';
import ContextProviders from '../../../../layouts/ContextProviders';
import { Button, Popover, Textarea, TextInput } from '@mantine/core';
import clsx from 'clsx';
import { useEffect, useMemo, useState, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Settings } from 'tabler-icons-react';
import { ImageToolData } from './ImageTool';

export const ImageToolView: FC<{
  data: ImageToolData;
  onDataChange: (data: Partial<ImageToolData>) => void;
  readOnly?: boolean;
}> = ({ data, onDataChange, readOnly }) => {
  const [imagePopoverOpen, setImagePopoverOpen] = useState(false);
  const [textPopoverOpen, setTextPopoverOpen] = useState(false);
  const [state, setState] = useState({ ...data });
  const { t } = useTranslation();

  useEffect(() => {
    setState({ ...data });
  }, [data]);
  useEffect(() => {
    onDataChange(state);
  }, [state, onDataChange]);

  const pickedFiles = useMemo(
    () => (state.fileId ? [state.fileId] : []),
    [state.fileId]
  );

  const onChange: SmallFileListProps['onChange'] = (itemId) => {
    setState({ ...state, fileId: itemId[0] || '' });
  };

  const onTextInput = (e) =>
    setState({ ...state, label: e.currentTarget.value });

  const onDescriptionInput = (e) =>
    setState({ ...state, description: e.currentTarget.value });

  return (
    <ContextProviders>
      <div
        className={clsx('relative aspect-[3/1] w-full rounded-lg bg-white p-5')}
      >
        {state.fileId ? (
          <BackendImage
            width={1500}
            imageId={state.fileId}
            className="absolute top-0 left-0 h-full w-full rounded-lg object-cover"
          />
        ) : (
          <div className="absolute top-0 left-0 h-full w-full rounded-lg bg-gray-200 object-cover" />
        )}

        {!readOnly && (
          <>
            <div className="absolute left-0 bottom-0 m-5 flex flex-col gap-5">
              <Popover
                withArrow
                width={590}
                position="top-start"
                withinPortal={false}
                opened={imagePopoverOpen}
                onClose={() => setImagePopoverOpen(false)}
              >
                <Popover.Target>
                  <Button
                    className="relative flex-none"
                    radius="xl"
                    size="lg"
                    variant="white"
                    leftIcon={<Pencil size={30} />}
                    onClick={() => setImagePopoverOpen((s) => !s)}
                  >
                    {t('Change image')}
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <SmallFileList
                    where={{
                      mimeType: { manipulator: 'LIKE', value: '%image%' },
                    }}
                    multiple={false}
                    pickedFiles={pickedFiles}
                    onChange={onChange}
                    triggerClose={() => setImagePopoverOpen(false)}
                  />
                </Popover.Dropdown>
              </Popover>
              <Popover
                withArrow
                width={590}
                position="top-start"
                withinPortal={false}
                opened={textPopoverOpen}
                onClose={() => setTextPopoverOpen(false)}
              >
                <Popover.Target>
                  <Button
                    className="relative flex-none"
                    radius="xl"
                    size="lg"
                    leftIcon={<Settings size={30} />}
                    onClick={() => setTextPopoverOpen((s) => !s)}
                  >
                    {t('Change metadata')}
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <TextInput
                    label={t('Label')}
                    value={state.label || ''}
                    placeholder={t('Some text')}
                    onChange={onTextInput}
                  />
                  <Textarea
                    label={t('Description')}
                    mt="sm"
                    value={state.description || ''}
                    placeholder={t('Some text')}
                    onChange={onDescriptionInput}
                  />
                  <Button
                    onClick={() => setTextPopoverOpen(false)}
                    className="mt-5"
                  >
                    Ok
                  </Button>
                </Popover.Dropdown>
              </Popover>
            </div>
          </>
        )}
      </div>
    </ContextProviders>
  );
};
