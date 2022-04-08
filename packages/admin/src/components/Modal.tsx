import { Dialog, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { FC, Fragment } from 'react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'small' | 'normal' | 'big' | 'large'
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'normal',
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto p-5"
        onClose={onClose}
      >
        <div className="grid min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-70" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className={clsx(
                'relative m-auto inline-block w-full transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all',
                size === 'small' && 'max-w-xl',
                size === 'normal' && 'max-w-4xl',
                size === 'big' && 'max-w-6xl',
                size === 'large' && 'max-w-7xl'
              )}
            >
              {title && (
                <Dialog.Title
                  as="h3"
                  className="ml-5 mt-5 border-b-2 pb-3 text-xl font-medium leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>
              )}

              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal
