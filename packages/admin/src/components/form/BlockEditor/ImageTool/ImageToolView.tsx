import BackendImage from '@components/BackendImage'
import {
  SmallFileList,
  SmallFileListProps,
} from '@components/FilePickerModal/SmallFileList'
import clsx from 'clsx'
import { useEffect, useMemo, useState, VFC } from 'react'
import { ImageToolData } from './ImageTool'

export const ImageToolView: VFC<{
  data: ImageToolData
  onDataChange: (data: Partial<ImageToolData>) => void
  readOnly?: boolean
}> = ({ data, onDataChange, readOnly }) => {
  const [state, setState] = useState({ ...data })

  useEffect(() => setState({ ...data }), [data])
  useEffect(() => onDataChange(state), [state, onDataChange])

  const pickedFiles = useMemo(
    () => (state.fileId ? [state.fileId] : []),
    [state.fileId]
  )

  const onChange: SmallFileListProps['onChange'] = (itemId) => {
    setState({ ...state, fileId: itemId[0] || '' })
  }

  return (
    <div
      className={clsx(
        'relative min-h-[200px] w-full',
        !readOnly && 'border-2 border-project-border shadow-md'
      )}
    >
      {!readOnly ? (
        <SmallFileList
          multiple={false}
          pickedFiles={pickedFiles}
          onChange={onChange}
        />
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
