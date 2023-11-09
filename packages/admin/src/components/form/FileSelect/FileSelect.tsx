import { MESSAGES } from '@constants';
import { Button, Input, Popover } from '@mantine/core';
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
import { Pencil } from 'tabler-icons-react';
import { FilePicker, FilePickerProps } from '../FilePicker';
import { MultipleItemDisplay } from './MultipleItemDisplay';
import { SingleItemDisplay } from './SingleItemDisplay';

export interface FileSelectProps
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

const FileSelect = forwardRef<HTMLInputElement, FileSelectProps>(
  function FileSelect(
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
            <div className="mt-1 items-center">
              <div
                className={clsx(
                  'relative mt-3 mb-5 overflow-hidden rounded-lg',
                  multiple ? 'border-2 border-gray-100' : ''
                )}
              >
                {multiple ? (
                  <MultipleItemDisplay pickedFiles={modalPickedFiles} />
                ) : (
                  <SingleItemDisplay pickedFileId={modalPickedFiles[0]} />
                )}
              </div>

              <Button
                color="ghost"
                leftIcon={<Pencil size={20} />}
                size="md"
                onClick={() => togglePickerOpen()}
              >
                {t(MESSAGES.EDIT)}
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
          title={t(MESSAGES.CHOOSE_A_FILE)}
        />
      </>
    );
  }
);

export default FileSelect;
