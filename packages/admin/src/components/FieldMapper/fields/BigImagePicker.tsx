import BackendImage from '@components/BackendImage';
import ItemsMissingMessage from '@components/ItemsMissingMessage';
import { FilePicker, FilePickerProps } from '@components/form/FilePicker';
import { MESSAGES } from '@constants';
import { FileLink } from '@custom-types';
import { ActionIcon, Button, Input, Paper } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import clsx from 'clsx';
import { FC, useCallback, useMemo } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash } from 'tabler-icons-react';
import { z } from 'zod';

import { columnTypeFileSchema } from '@prom-cms/schema';

export interface BigImageProps extends z.infer<typeof columnTypeFileSchema> {
  name: string;
  errorMessage?: string;
  label?: string;
  disabled?: boolean;
}

const TOTAL_ON_ROW = 4;

export const BigImagePicker: FC<BigImageProps> = ({
  name,
  errorMessage,
  label: labelAsText,
  multiple,
  typeFilter,
}) => {
  const [pickerOpen, toggleOpen] = useToggle();
  const { field } = useController({
    name,
  });
  const { t } = useTranslation();

  const onRemoveOne = useCallback(
    (itemToRemove: FileLink) => {
      if (!multiple) {
        return;
      }

      field.onChange(
        field.value.filter((itemValue) => itemValue?.id != itemToRemove.id)
      );
      field.onBlur();
    },
    [field.onChange, multiple, field.value, field.onBlur]
  );

  const modalPickedFiles = useMemo(
    () =>
      (Array.isArray(field.value) ? field.value : [field.value]).filter(
        Boolean
      ) as FileLink[],
    [field.value]
  );

  const onChange = useCallback<NonNullable<FilePickerProps['onChange']>>(
    (nextValue) => {
      if (multiple) {
        field.onChange(nextValue);

        return;
      }

      // We pick last, because FilePicker component has always array - if user picks other then there will be two values in the array
      field.onChange(nextValue?.at(-1) ?? null);
      field.onBlur();
    },
    [field.onChange, multiple, field.onBlur]
  );

  const isImage = typeFilter?.includes('image');
  const picker = (
    <>
      <FilePicker
        value={modalPickedFiles}
        onChange={onChange}
        closeOnPick={!multiple}
        title={t(multiple ? MESSAGES.CHOOSE_IMAGES : MESSAGES.CHOOSE_IMAGE)}
        fileQueryParameters={{
          where: { mimeType: { manipulator: 'LIKE', value: '%image%' } },
        }}
        isOpen={pickerOpen}
        onClose={toggleOpen}
      />
    </>
  );

  const label = (
    <>
      {labelAsText}
      {multiple && isImage && !!modalPickedFiles.length ? (
        <Button
          size="compact-sm"
          rightSection={<Pencil size={15} />}
          className="ml-auto block"
          variant="light"
          onClick={() => toggleOpen()}
        >
          {t(MESSAGES.CHANGE_SELECTION)}
        </Button>
      ) : null}
    </>
  );

  const placeholderCount =
    TOTAL_ON_ROW - (modalPickedFiles.length % TOTAL_ON_ROW);

  return (
    <Input.Wrapper
      size="md"
      label={label}
      error={errorMessage}
      classNames={{ label: 'w-full flex' }}
    >
      <div>
        {isImage ? (
          multiple ? (
            <>
              <div className="grid sm:grid-cols-4 gap-3 mt-1 mb-3">
                {modalPickedFiles.length ? (
                  <>
                    {modalPickedFiles.map((file) => (
                      <div
                        className="w-full aspect-square rounded-lg overflow-hidden relative shadow-md"
                        key={file.id}
                      >
                        <BackendImage
                          width={250}
                          quality={90}
                          imageId={file.id}
                          className="absolute h-full w-full object-cover object-center"
                        />
                        <div className="absolute top-0 right-0 m-2">
                          <ActionIcon
                            size="lg"
                            color="red"
                            variant="filled"
                            onClick={() => onRemoveOne(file)}
                          >
                            <Trash size={20} />
                          </ActionIcon>
                        </div>
                      </div>
                    ))}
                    {new Array(placeholderCount).fill(true).map((_, index) => (
                      <Paper
                        key={index}
                        className={
                          'bg-blue-50 opacity-60 dark:opacity-100 aspect-square border-dashed'
                        }
                      />
                    ))}
                  </>
                ) : (
                  <Paper
                    className={clsx(
                      'w-full col-span-full py-5',
                      errorMessage ? 'border-red-400' : ''
                    )}
                  >
                    <ItemsMissingMessage />
                    <Button
                      color="blue"
                      variant="light"
                      leftSection={<Pencil size={20} />}
                      onClick={() => toggleOpen()}
                      className="backdrop-blur-sm mx-auto block mt-4"
                    >
                      {t(MESSAGES.CHOOSE_IMAGES)}
                    </Button>
                  </Paper>
                )}
              </div>
              {picker}
            </>
          ) : (
            <div
              className={clsx(
                'min-h-[15rem] h-[50vh] w-full relative rounded-lg border bg-blue-50 dark:backdrop-blur-md dark:bg-gray-800 sm:dark:bg-opacity-60',
                errorMessage ? 'border-red-400' : 'border-blue-100'
              )}
            >
              {modalPickedFiles.length ? (
                <BackendImage
                  width={900}
                  quality={75}
                  imageId={modalPickedFiles[0]?.id}
                  className="absolute h-full w-full object-contain object-center rounded-lg overflow-hidden "
                />
              ) : null}
              <Button
                color="blue"
                variant="light"
                size="lg"
                leftSection={<Pencil size={20} />}
                onClick={() => toggleOpen()}
                className={clsx('backdrop-blur-sm m-2')}
              >
                {t(!modalPickedFiles.length ? 'Set image' : 'Change image')}
              </Button>
              {picker}
            </div>
          )
        ) : (
          <>BigImage is not made for files</>
        )}
      </div>
    </Input.Wrapper>
  );
};
