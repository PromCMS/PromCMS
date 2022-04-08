import { Button } from '@components/Button'
import FilePickerModal from '@components/FilePickerModal'
import { PhotographIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  ReactElement,
  useState,
} from 'react'
import { Label } from './Label'

export interface ImageSelectProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string
  prefixIcon?: ReactElement
  error?: string
  touched?: boolean
  wrapperClassName?: string
}

const ImageSelect = forwardRef<HTMLInputElement, ImageSelectProps>(
  function ImageSelect(
    { wrapperClassName, label, className, onChange, ...rest },
    ref
  ) {
    const [modalOpen, setModalOpen] = useState(false)

    return (
      <>
        <div className={wrapperClassName}>
          {label && <Label>{label}</Label>}
          <input ref={ref} className={clsx('hidden', className)} {...rest} />
          <div className="mt-1 flex items-center">
            <div className="relative mr-6 aspect-square w-20 overflow-hidden rounded-full">
              <div className="absolute flex h-full w-full bg-gray-200">
                <PhotographIcon className="m-auto aspect-square w-10 stroke-slate-500" />
              </div>
            </div>

            <Button
              className="flex-none"
              color="ghost"
              icon="PencilAltIcon"
              onClick={() => setModalOpen(true)}
            >
              Change
            </Button>
          </div>
        </div>
        <FilePickerModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </>
    )
  }
)

export default ImageSelect
