import BackendImage from '@components/BackendImage'
import {
  SmallFileList,
  SmallFileListProps,
} from '@components/FilePickerModal/SmallFileList'
import { TextInput } from '@mantine/core'
import clsx from 'clsx'
import { useEffect, useMemo, useState, VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageToolData } from './ImageTool'

export const ImageToolView: VFC<{
  data: ImageToolData
  onDataChange: (data: Partial<ImageToolData>) => void
  readOnly?: boolean
}> = ({ data, onDataChange, readOnly }) => {
  const [state, setState] = useState({ ...data })
  const { t } = useTranslation()

  useEffect(() => setState({ ...data }), [data])
  useEffect(() => onDataChange(state), [state, onDataChange])

  const pickedFiles = useMemo(
    () => (state.fileId ? [state.fileId] : []),
    [state.fileId]
  )

  const onChange: SmallFileListProps['onChange'] = (itemId) => {
    setState({ ...state, fileId: itemId[0] || '' })
  }

  const onTextInput = (e) =>
    setState({ ...state, label: e.currentTarget.value })

  return (
    <div
      className={clsx(
        'relative min-h-[200px] w-full rounded-lg bg-white p-5',
        !readOnly && 'border-2 border-project-border shadow-md'
      )}
    >
      {!readOnly ? (
        <>
          <SmallFileList
            filter={[['mimeType', 'regexp', `^image/.*$`]]}
            multiple={false}
            pickedFiles={pickedFiles}
            onChange={onChange}
          />
          <hr className="my-5 mb-2 h-0.5 w-full border-none bg-gray-200" />
          <TextInput
            label={t('Label')}
            value={state.label}
            placeholder={t('Some text')}
            onChange={onTextInput}
            className="mt-5"
          />
        </>
      ) : state.fileId ? (
        <BackendImage
          imageId={state.fileId}
          className="absolute top-0 left-0 h-full w-full rounded-lg object-cover"
        />
      ) : (
        ''
      )}
    </div>
  )
}
