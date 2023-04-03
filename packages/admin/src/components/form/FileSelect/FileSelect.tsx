import { SmallFileList } from '@components/FilePickerModal/SmallFileList';
import { MESSAGES } from '@constants';
import { Button, Input, Popover } from '@mantine/core';
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
import { Pencil } from 'tabler-icons-react';
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
        selected === null || selected === undefined || selected === 'undefined'
          ? []
          : Array.isArray(selected)
          ? selected
          : [selected],
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

              <Popover
                withArrow
                opened={modalOpen}
                onClose={onClose}
                withinPortal={false}
                width={590}
                position="bottom-end"
              >
                <Popover.Target>
                  <Button
                    color="ghost"
                    leftIcon={<Pencil size={20} />}
                    size="md"
                    onClick={() => setModalOpen(true)}
                  >
                    {t(MESSAGES.EDIT)}
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <SmallFileList
                    title={t(MESSAGES.CHOOSE_A_FILE)}
                    triggerClose={onClose}
                    multiple={multiple}
                    pickedFiles={modalPickedFiles}
                    onChange={onChangeCallback}
                  />
                </Popover.Dropdown>
              </Popover>
            </div>
          </Input.Wrapper>
        </div>
      </>
    );
  }
);

export default FileSelect;
