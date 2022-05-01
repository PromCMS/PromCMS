import BackendImage from '@components/BackendImage'
import {
  SmallFileList,
  SmallFileListProps,
} from '@components/FilePickerModal/SmallFileList'
import ThemeProvider from '@components/ThemeProvider'
import { TextInput, Title } from '@mantine/core'
import clsx from 'clsx'
import { useEffect, useState, VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { GalleryToolData } from './GalleryTool'

export const ImageToolView: VFC<{
  data: GalleryToolData
  onDataChange: (data: Partial<GalleryToolData>) => void
  readOnly: boolean
}> = ({ data, onDataChange, readOnly }) => {
  const [state, setState] = useState({ ...data })
  const { t } = useTranslation()

  useEffect(() => setState({ ...data }), [data])
  useEffect(() => onDataChange(state), [state, onDataChange])

  const onFilesChange: SmallFileListProps['onChange'] = (itemIds) => {
    setState({ ...state, fileIds: itemIds })
  }

  const onTextInput = (e) =>
    setState({ ...state, label: e.currentTarget.value })

  return (
    <ThemeProvider>
      <div
        className={clsx(
          'relative min-h-[200px] w-full rounded-lg bg-white p-5',
          readOnly
            ? 'grid grid-cols-2 gap-3'
            : 'border-2 border-project-border shadow-md'
        )}
      >
        {!readOnly ? (
          <>
            <Title order={3}>{t('Choose gallery images')}</Title>
            <TextInput
              label={t('Label')}
              value={state.label || ''}
              placeholder={t('Some text')}
              onChange={onTextInput}
              className="mt-2"
            />
            <hr className="mb-8 mt-4 h-0.5 w-full border-none bg-gray-200" />

            <SmallFileList
              multiple
              filter={[['mimeType', 'regexp', `^image/.*$`]]}
              pickedFiles={state.fileIds || []}
              onChange={onFilesChange}
            />
          </>
        ) : (state.fileIds || []).length ? (
          state.fileIds?.map((fileId) => (
            <div key={fileId} className="relative aspect-square w-full">
              <BackendImage
                imageId={fileId}
                className="absolute top-0 left-0 h-full w-full rounded-lg border-2 border-project-border object-cover"
              />
            </div>
          ))
        ) : (
          ''
        )}
      </div>
    </ThemeProvider>
  )
}
