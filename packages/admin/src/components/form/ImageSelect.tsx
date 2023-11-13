import BackendImage from '@components/BackendImage';
import { Button, Input } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { ItemID } from '@prom-cms/shared';
import clsx from 'clsx';
import {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  ReactElement,
  useCallback,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Photo } from 'tabler-icons-react';
import { FilePicker, FilePickerProps } from './FilePicker';

export interface ImageSelectProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'value' | 'onChange' | 'multiple' | 'onBlur'
  > {
  label?: string;
  prefixIcon?: ReactElement;
  error?: string;
  touched?: boolean;
  multiple?: boolean;
  wrapperClassName?: string;
  selected: ItemID | ItemID[] | undefined | null;
  onChange: (newValue: ItemID | ItemID[] | null) => void;
  onBlur?: () => void;
}

// TODO: probably deprecate this and use normal FileSelect instead?
const ImageSelect = forwardRef<HTMLInputElement, ImageSelectProps>(
  function ImageSelect(
    {
      wrapperClassName,
      label,
      className,
      selected,
      onChange,
      onBlur,
      multiple,
      error,
    },
    ref
  ) {
    const [pickerOpen, togglePickerOpen] = useToggle();
    const { t } = useTranslation();

    const onChangeCallback = useCallback<FilePickerProps['onChange']>(
      (nextValue) => {
        if (multiple) {
          onChange(nextValue);

          return;
        }

        // We pick last, because FilePicker component has always array - if user picks other then there will be two values in the array
        onChange(nextValue?.at(-1) ?? null);
        if (onBlur) onBlur();
      },
      [onChange, multiple, onBlur]
    );

    const modalPickedFiles = useMemo(
      () =>
        (Array.isArray(selected) ? selected : [selected]).filter(
          Boolean
        ) as string[],
      [selected]
    );

    return (
      <>
        <div className={clsx(wrapperClassName, className)}>
          <Input.Wrapper size="md" label={label} error={error}>
            <div className="mt-1 flex items-center">
              <div className="relative mr-6 aspect-square w-20 overflow-hidden rounded-lg">
                {modalPickedFiles.length ? (
                  <BackendImage
                    width={80}
                    quality={60}
                    imageId={modalPickedFiles[0]}
                    className="absolute h-full w-full object-contain object-center"
                  />
                ) : (
                  <div className="absolute flex h-full w-full bg-gray-200">
                    <Photo
                      size={40}
                      className="icon icon-tabler icon-tabler-photo m-auto"
                    />
                  </div>
                )}
              </div>
              <Button
                className="flex-none"
                color="ghost"
                leftIcon={<Pencil size={20} />}
                size="md"
                onClick={() => togglePickerOpen()}
              >
                {t('Change')}
              </Button>
            </div>
          </Input.Wrapper>
        </div>
        <FilePicker
          isOpen={pickerOpen}
          closeOnPick={!multiple}
          onChange={onChangeCallback}
          onClose={() => togglePickerOpen()}
          value={modalPickedFiles}
          title={t('Choose an image')}
          fileQueryParameters={{
            where: { mimeType: { manipulator: 'LIKE', value: '%image%' } },
          }}
        />
      </>
    );
  }
);

export default ImageSelect;
