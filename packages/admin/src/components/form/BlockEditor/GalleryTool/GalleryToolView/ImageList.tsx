import { SmallFileList } from '@components/FilePickerModal/SmallFileList'
import { Button, Popover } from '@mantine/core'
import { iconSet } from '@prom-cms/icons'
import { useState } from 'react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useGalleryToolViewContext } from './context'
import { ImageItem } from './ImageItem'

export const ImageList: FC = () => {
  const { t } = useTranslation()
  const [popoverOpen, setPopoverOpen] = useState(false)
  const { fileIds, addFile, readOnly } = useGalleryToolViewContext()

  return (
    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {fileIds?.map((props) => (
        <ImageItem key={props.id} {...props} />
      ))}
      {!readOnly && (
        <Popover
          withArrow
          opened={popoverOpen}
          onClose={() => setPopoverOpen(false)}
          className="w-full"
          positionDependencies={[fileIds]}
          withinPortal={false}
          width={590}
          placement="start"
          target={
            <Button
              size="lg"
              variant="light"
              title={t('Select new image')}
              className="flex aspect-square h-full w-full items-center justify-center"
              onClick={() => setPopoverOpen((s) => !s)}
            >
              <iconSet.Plus size={50} />
            </Button>
          }
        >
          <SmallFileList
            multiple
            where={{
              mimeType: { manipulator: 'LIKE', value: '%image%' },
            }}
            pickedFiles={fileIds?.map(({ id }) => id) || []}
            onChange={addFile}
            triggerClose={() => setPopoverOpen(false)}
          />
        </Popover>
      )}
    </div>
  )
}
