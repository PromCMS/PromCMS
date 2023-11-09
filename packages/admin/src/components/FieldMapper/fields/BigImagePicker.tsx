import BackendImage from '@components/BackendImage';
import { FilePicker, FilePickerProps } from '@components/form/FilePicker';
import { ActionIcon, Button, clsx, Input } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { columnTypeFileSchema } from '@prom-cms/schema';
import { FC, useCallback, useMemo } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash } from 'tabler-icons-react';
import { z } from 'zod';

export interface BigImageProps extends z.infer<typeof columnTypeFileSchema> {
  name: string;
  errorMessage?: string;
  label?: string;
  disabled?: boolean;
}

export const BigImagePicker: FC<BigImageProps> = ({
  name,
  errorMessage,
  label,
  multiple,
  typeFilter,
}) => {
  const [pickerOpen, toggleOpen] = useToggle();
  const { field } = useController({
    name,
  });
  const { t } = useTranslation();

  const onRemoveOne = useCallback(
    (nextValue: string) => {
      if (!multiple) {
        return;
      }

      field.onChange(field.value.filter((itemValue) => itemValue != nextValue));
      field.onBlur();
    },
    [field.onChange, multiple, field.value, field.onBlur]
  );

  const modalPickedFiles = useMemo(
    () =>
      (Array.isArray(field.value) ? field.value : [field.value]).filter(
        Boolean
      ),
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
      <Button
        color="ghost"
        size="lg"
        leftIcon={<Pencil size={20} />}
        onClick={() => toggleOpen()}
        className={clsx([!multiple && 'm-5'])}
      >
        {t(!modalPickedFiles.length ? 'Set image' : 'Change image')}
      </Button>
      <FilePicker
        value={modalPickedFiles}
        onChange={onChange}
        closeOnPick={!multiple}
        title={t(multiple ? 'Choose images' : 'Choose an image')}
        fileQueryParameters={{
          where: { mimeType: { manipulator: 'LIKE', value: '%image%' } },
        }}
        isOpen={pickerOpen}
        onClose={toggleOpen}
      />
    </>
  );

  return (
    <Input.Wrapper size="md" label={label} error={errorMessage}>
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
                  quality={75}
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
    </Input.Wrapper>
  );
};
