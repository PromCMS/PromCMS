import BackendImage from '@components/BackendImage'
import { ActionIcon, Button, Popover, Textarea, TextInput } from '@mantine/core'
import { iconSet } from '@prom-cms/icons'
import { useState } from 'react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageInfo } from '../GalleryTool'
import { useGalleryToolViewContext } from './context'

export const ImageItem: FC<ImageInfo> = ({ id, description, title }) => {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const { readOnly, removeFile, changeMetadata } = useGalleryToolViewContext()
  const { t } = useTranslation()

  return (
    <div className="relative aspect-square w-full">
      <BackendImage
        imageId={id}
        width={290}
        quality={40}
        className="absolute top-0 left-0 h-full w-full overflow-hidden rounded-xl object-cover object-center"
      />
      {!readOnly && (
        <div className="absolute right-0 bottom-0 m-3 flex gap-3">
          <Popover
            withArrow
            opened={popoverOpen}
            onClose={() => setPopoverOpen(false)}
            withinPortal={false}
            width={590}
            position="top"
            placement="center"
            target={
              <ActionIcon
                size="xl"
                color="blue"
                variant="filled"
                title={t('Select new image')}
                className="aspect-square w-full"
                onClick={() => setPopoverOpen((s) => !s)}
              >
                <iconSet.Settings size={30} />
              </ActionIcon>
            }
          >
            <TextInput
              label={t('Title')}
              value={title || ''}
              placeholder={t('Some text')}
              onChange={(e) =>
                changeMetadata('title', id, e.currentTarget.value)
              }
            />
            <Textarea
              label={t('Description')}
              mt="sm"
              value={description || ''}
              placeholder={t('Some text')}
              onChange={(e) =>
                changeMetadata('description', id, e.currentTarget.value)
              }
            />
            <Button onClick={() => setPopoverOpen(false)} className="mt-5">
              Ok
            </Button>
          </Popover>
          <ActionIcon
            size="xl"
            color="red"
            variant="filled"
            onClick={() => removeFile(id)}
          >
            <iconSet.Trash size={30} />
          </ActionIcon>
        </div>
      )}
    </div>
  )
}
