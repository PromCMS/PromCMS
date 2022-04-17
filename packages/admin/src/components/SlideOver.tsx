import { Dialog } from '@headlessui/react'
import { iconSet } from '@prom-cms/icons'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './Button'

export interface SlideOverProps {
  isOpen: boolean
  onRequestClose: () => void
  title?: string
  description?: string
  size?: 'big' | 'small'
}

const SlideOver: FC<SlideOverProps> = ({
  title,
  description,
  isOpen,
  onRequestClose,
  children,
  size = 'big',
}) => {
  const { t } = useTranslation()

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          open={isOpen}
          onClose={onRequestClose}
          as={motion.div}
          className="fixed top-0 left-0 h-full w-full"
        >
          <Dialog.Overlay
            className="fixed inset-0 z-0 bg-black opacity-30 backdrop-blur-lg"
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className={clsx(
              'relative z-10 float-right h-screen bg-white',
              size === 'big' && 'w-[90%]',
              size === 'small' && 'w-[calc(100%-150px)] max-w-[500px]'
            )}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0, x: 250 }}
          >
            <Button
              color="error"
              className="absolute left-0 top-4 flex h-[56px] -translate-x-full transform items-center !rounded-r-none text-xl font-semibold"
              onClick={onRequestClose}
            >
              <iconSet.X className="my-0.5 inline w-7" /> {t('Close')}
            </Button>
            {title && (
              <Dialog.Title className="m-9 mb-0 text-2xl font-semibold">
                {title}
              </Dialog.Title>
            )}
            {description && (
              <Dialog.Description className="ml-9 mt-5 text-lg">
                {description}
              </Dialog.Description>
            )}
            <div className="h-full overflow-y-auto pl-9 pt-5">{children}</div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

export default SlideOver
