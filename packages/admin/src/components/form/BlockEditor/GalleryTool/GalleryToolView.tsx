import BackendImage from '@components/BackendImage'
import {
  SmallFileList,
  SmallFileListProps,
} from '@components/FilePickerModal/SmallFileList'
import clsx from 'clsx'
import { useEffect, useMemo, useState, VFC } from 'react'
import { GalleryToolData } from './GalleryTool'

export const ImageToolView: VFC<{
  data: GalleryToolData
  onDataChange: (data: Partial<GalleryToolData>) => void
  readOnly: boolean
}> = ({ data, onDataChange, readOnly }) => {
  const [state, setState] = useState({ ...data })

  useEffect(() => setState({ ...data }), [data])
  useEffect(() => onDataChange(state), [state, onDataChange])

  const onFilesChange: SmallFileListProps['onChange'] = (itemIds) => {
    setState({ ...state, fileIds: itemIds })
  }

  return (
    <div
      className={clsx(
        'relative min-h-[200px] w-full',
        readOnly
          ? 'grid grid-cols-2 gap-3'
          : 'border-2 border-project-border shadow-md'
      )}
    >
      {!readOnly ? (
        <SmallFileList
          multiple
          pickedFiles={state.fileIds || []}
          onChange={onFilesChange}
        />
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
  )
}
