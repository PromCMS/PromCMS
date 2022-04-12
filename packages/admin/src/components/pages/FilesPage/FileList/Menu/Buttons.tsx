import { Button } from '@components/Button'
import Popover from '@components/Popover'
import PopoverList from '@components/PopoverList'
import { iconSet } from '@prom-cms/icons'
import { forwardRef, VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { useFileListContext } from '../context'

const GreenButton = forwardRef<HTMLButtonElement>(function GreenButton(
  { children, ...rest },
  ref
) {
  return (
    <Button ref={ref} color="success" {...rest}>
      {children}
    </Button>
  )
})

export const Buttons: VFC = () => {
  const { updateValue, openFilePicker } = useFileListContext()
  const { t } = useTranslation()

  return (
    <div className="ml-3 grid aspect-square h-full flex-none">
      <Popover
        buttonComponent={GreenButton}
        buttonClassName="h-full aspect-square flex"
        offset={[0, 10]}
        placement="bottom-end"
        buttonContent={
          <iconSet.PlusIcon className="absolute left-3 top-3 w-8" />
        }
      >
        <PopoverList>
          <PopoverList.Item
            icon="DocumentAddIcon"
            title="Add new file to current folder"
          >
            {/* FIXME: resolve bug around icon not being clickable */}
            <button
              type="button"
              onClick={openFilePicker}
              className="-mx-4 -my-1.5 px-4 py-1.5"
            >
              {t('Add new file')}
            </button>
          </PopoverList.Item>
          <PopoverList.Item
            icon="FolderAddIcon"
            onClick={() => updateValue('showNewFolderCreator', true)}
            title="Add new folder to current folder"
          >
            {t('Add new folder')}
          </PopoverList.Item>
        </PopoverList>
      </Popover>
    </div>
  )
}
