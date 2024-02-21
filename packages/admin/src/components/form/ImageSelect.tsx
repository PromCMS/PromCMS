import BackendImage from '@components/BackendImage';
import { MESSAGES } from '@constants';
import { Button, Input, Paper } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import clsx from 'clsx';
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Photo } from 'tabler-icons-react';
import { EntityLink } from 'types/EntityLink';

import { FileItem } from '@prom-cms/api-client';

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
  classNames?: {
    wrapper?: string;
    imageWrapper?: string;
  };
  imageWrapperProps?: {
    disableStyles?: boolean;
  };
  imageProps?: {
    width?: number;
    quality?: number;
  };
  placeholderElement?: ReactNode;
  selected: EntityLink<FileItem> | EntityLink<FileItem>[] | undefined | null;
  onChange: (
    newValue: EntityLink<FileItem> | EntityLink<FileItem>[] | null
  ) => void;
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
      classNames,
      imageWrapperProps,
      placeholderElement,
      imageProps,
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
        ) as EntityLink<FileItem>[],
      [selected]
    );

    return (
      <>
        <div className={clsx(wrapperClassName, className)}>
          <Input.Wrapper size="md" label={label} error={error}>
            <div className={clsx('flex items-center', classNames?.wrapper)}>
              <div
                className={clsx(
                  !imageWrapperProps?.disableStyles
                    ? 'relative mr-6 aspect-square w-20 overflow-hidden rounded-lg'
                    : '',
                  classNames?.imageWrapper
                )}
              >
                {modalPickedFiles.length ? (
                  <BackendImage
                    width={imageProps?.width ?? 80}
                    quality={imageProps?.quality ?? 60}
                    imageId={modalPickedFiles[0]?.id}
                    className="absolute h-full w-full object-contain object-center bg-blue-50 border border-blue-200"
                  />
                ) : (
                  <Paper
                    className={clsx(
                      error ? 'border-red-400' : '',
                      'aspect-square flex'
                    )}
                  >
                    {placeholderElement ?? (
                      <Photo
                        size={40}
                        className="icon icon-tabler icon-tabler-photo m-auto"
                      />
                    )}
                  </Paper>
                )}
              </div>
              <Button
                className="flex-none"
                leftSection={<Pencil size={20} />}
                size="md"
                onClick={() => togglePickerOpen()}
              >
                {t(MESSAGES.CHANGE_SELECTION)}
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
          title={t(MESSAGES.CHOOSE_IMAGE)}
          fileQueryParameters={{
            where: { mimeType: { manipulator: 'LIKE', value: '%image%' } },
          }}
        />
      </>
    );
  }
);

export default ImageSelect;
