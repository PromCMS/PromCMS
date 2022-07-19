import BackendImage from '@components/BackendImage';
import { SmallFileList } from '@components/FilePickerModal/SmallFileList';
import { Button, InputWrapper, Popover } from '@mantine/core';
import { ItemID } from '@prom-cms/shared';
import clsx from 'clsx';
import {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Photo } from 'tabler-icons-react';

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
    const [modalOpen, setModalOpen] = useState(false);
    const { t } = useTranslation();

    const onChangeCallback = useCallback(
      (ids: ItemID[]) => {
        onChange(!multiple ? ids[0] || null : ids);
      },
      [onChange, multiple]
    );

    const onClose = useCallback(() => {
      setModalOpen(false);
      if (onBlur) onBlur();
    }, [onBlur, setModalOpen]);

    const modalPickedFiles = useMemo(
      () =>
        selected === null || selected === undefined
          ? []
          : Array.isArray(selected)
          ? selected
          : [selected],
      [selected]
    );

    return (
      <>
        <div className={clsx(wrapperClassName, className)}>
          <InputWrapper size="md" label={label} error={error}>
            <div className="mt-1 flex items-center">
              <div className="relative mr-6 aspect-square w-20 overflow-hidden rounded-full">
                {modalPickedFiles.length ? (
                  <BackendImage
                    width={80}
                    quality={40}
                    imageId={modalPickedFiles[0]}
                    className="absolute h-full w-full object-cover object-center"
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

              <Popover
                withArrow
                opened={modalOpen}
                onClose={onClose}
                withinPortal={false}
                target={
                  <Button
                    className="flex-none"
                    color="ghost"
                    leftIcon={<Pencil size={20} />}
                    size="md"
                    onClick={() => setModalOpen(true)}
                  >
                    {t('Change')}
                  </Button>
                }
                width={590}
                placement="end"
                position="bottom"
              >
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
              </Popover>
            </div>
          </InputWrapper>
        </div>
      </>
    );
  }
);

export default ImageSelect;
