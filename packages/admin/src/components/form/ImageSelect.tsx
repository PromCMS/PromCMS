import BackendImage from '@components/BackendImage'
import FilePickerModal from '@components/FilePickerModal'
import { Button, InputWrapper } from '@mantine/core'
import { iconSet } from '@prom-cms/icons'
import { ItemID } from '@prom-cms/shared'
import clsx from 'clsx'
import {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

export interface ImageSelectProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'value' | 'onChange' | 'multiple' | 'onBlur'
  > {
  label?: string
  prefixIcon?: ReactElement
  error?: string
  touched?: boolean
  multiple?: boolean
  wrapperClassName?: string
  selected: ItemID | ItemID[] | null
  onChange: (newValue: ItemID | ItemID[] | null) => void
  onBlur?: () => void
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
    const [modalOpen, setModalOpen] = useState(false)
    const { t } = useTranslation()

    const onChangeCallback = useCallback(
      (ids: ItemID[]) => {
        onChange(multiple ? ids[0] || null : ids)
      },
      [onChange, multiple]
    )

    const onClose = useCallback(() => {
      setModalOpen(false)
      if (onBlur) onBlur()
    }, [onBlur, setModalOpen])

    const modalPickedFiles = useMemo(
      () =>
        selected === null
          ? []
          : Array.isArray(selected)
          ? selected
          : [selected],
      [selected]
    )

    return (
      <>
        <div className={clsx(wrapperClassName, className)}>
          <InputWrapper label={label} error={error}>
            <div className="mt-1 flex items-center">
              <div className="relative mr-6 aspect-square w-20 overflow-hidden rounded-full">
                {modalPickedFiles.length ? (
                  <BackendImage
                    imageId={modalPickedFiles[0]}
                    className="absolute h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="absolute flex h-full w-full bg-gray-200">
                    <iconSet.Photo className="m-auto aspect-square w-10 stroke-slate-500" />
                  </div>
                )}
              </div>

              <Button
                className="flex-none"
                color="ghost"
                leftIcon={<iconSet.Pencil size={20} />}
                size="md"
                onClick={() => setModalOpen(true)}
              >
                {t('Change')}
              </Button>
            </div>
          </InputWrapper>
        </div>
        <FilePickerModal
          title={t('Choose an image')}
          filter={[['mimeType', 'regexp', `^image/.*$`]]}
          multiple={multiple}
          isOpen={modalOpen}
          onClose={onClose}
          pickedFiles={modalPickedFiles}
          onChange={onChangeCallback}
        />
      </>
    )
  }
)

export default ImageSelect
