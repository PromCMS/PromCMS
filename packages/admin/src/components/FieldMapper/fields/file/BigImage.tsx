import BackendImage from '@components/BackendImage';
import { SmallFileList } from '@components/FilePickerModal/SmallFileList';
import { ActionIcon, Button, clsx, Popover, Input } from '@mantine/core';
import { ItemID } from '@prom-cms/shared';
import { FC, useCallback, useMemo, useState, forwardRef } from 'react';
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash } from 'tabler-icons-react';
import { NormalProps } from './Normal';

const ImageInput: FC<
  Omit<
    ControllerRenderProps<FieldValues, string> & {
      multiple: boolean;
      typeFilter?: string;
    },
    'ref'
  >
> = ({ onBlur, onChange, value, multiple, typeFilter }) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const onClose = useCallback(() => {
    setModalOpen(false);
    onBlur();
  }, [setModalOpen, onBlur]);

  const onChangeCallback = useCallback(
    (ids: ItemID[]) => {
      onChange(!multiple ? ids[0] || null : ids);
    },
    [onChange, multiple]
  );

  const onRemoveOne = useCallback(
    (nextValue: string) => {
      if (!multiple) {
        return;
      }

      onChange(value.filter((itemValue) => itemValue != nextValue));
    },
    [onChange, multiple, value]
  );

  const modalPickedFiles = useMemo(
    () =>
      value === null || value === undefined
        ? []
        : Array.isArray(value)
        ? value
        : [value],
    [value]
  );

  const isImage = typeFilter?.includes('image');

  const picker = (
    <Popover
      withArrow
      opened={modalOpen}
      onClose={() => {
        onBlur();
        onClose();
      }}
      withinPortal={false}
      width={590}
      position="bottom-end"
    >
      <Popover.Target>
        <Button
          color="ghost"
          size="lg"
          leftIcon={<Pencil size={20} />}
          onClick={() => setModalOpen(true)}
          className={clsx([!multiple && 'm-5'])}
        >
          {t(value ? 'Set image' : 'Change image')}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <SmallFileList
          where={{
            mimeType: { manipulator: 'LIKE', value: '%image%' },
          }}
          title={t('Choose an image')}
          triggerClose={onClose}
          multiple={multiple}
          pickedFiles={modalPickedFiles}
          onChange={onChangeCallback}
        />
      </Popover.Dropdown>
    </Popover>
  );

  return (
    <div>
      {isImage ? (
        multiple ? (
          <>
            <div className="grid sm:grid-cols-5 gap-5 mt-3 mb-5">
              {modalPickedFiles.length ? (
                modalPickedFiles.map((fileId) => (
                  <div className="w-full aspect-square rounded-lg overflow-hidden relative">
                    <BackendImage
                      width={250}
                      quality={90}
                      imageId={fileId}
                      className="absolute h-full w-full object-cover object-center"
                    />
                    <div className="absolute top-0 right-0 m-3">
                      <ActionIcon
                        size="xl"
                        color="red"
                        variant="filled"
                        onClick={() => onRemoveOne(fileId)}
                      >
                        <Trash />
                      </ActionIcon>
                    </div>
                  </div>
                ))
              ) : (
                <div>{t('Empty')}</div>
              )}
            </div>
            {picker}
          </>
        ) : (
          <div className="h-[50vh] w-full relative">
            {modalPickedFiles.length ? (
              <BackendImage
                width={1600}
                quality={60}
                imageId={modalPickedFiles[0]}
                className="absolute h-full w-full object-cover object-center rounded-lg overflow-hidden"
              />
            ) : (
              <div className="absolute top-0 left-0 h-full w-full bg-gray-200 rounded-lg overflow-hidden" />
            )}
            {picker}
          </div>
        )
      ) : (
        <>TODO</>
      )}
    </div>
  );
};

export const BigImage: FC<NormalProps> = ({
  name,
  errorMessage,
  label,
  multiple,
  typeFilter,
}) => {
  return (
    <Input.Wrapper size="md" label={label} error={errorMessage}>
      <Controller
        name={name}
        render={({ field: { name, onBlur, onChange, value } }) => (
          <ImageInput
            multiple={multiple}
            typeFilter={typeFilter}
            name={name}
            onBlur={onBlur}
            onChange={onChange}
            value={value}
          />
        )}
      />
    </Input.Wrapper>
  );
};
