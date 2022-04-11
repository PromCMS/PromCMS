import { useCallback, useRef, VFC } from 'react'
import dynamic from 'next/dynamic'
import type EditorJS from '@editorjs/editorjs'
import { Controller, useFormContext } from 'react-hook-form'
import type { LazyEditorProps } from './LazyEditor'
import { useTranslation } from 'react-i18next'

const LazyEditor = dynamic(
  async () => (await import('./LazyEditor')).LazyEditor,
  { ssr: false }
)

export type BlockEditorProps = LazyEditorProps

export const BlockEditor: VFC<BlockEditorProps> = (props) => {
  const editorRef = useRef<EditorJS>()
  const { control } = useFormContext()
  const { t } = useTranslation()

  const onEditorChange = useCallback(
    (onChange) => async (api: EditorJS.API, event: CustomEvent) =>
      onChange(JSON.stringify(await api.saver.save())),
    []
  )

  return (
    <Controller
      control={control}
      name="content"
      render={({ field: { onChange } }) => (
        <LazyEditor
          ref={editorRef}
          onChange={onEditorChange(onChange)}
          placeholder={t('Start typing here...') as string}
          {...props}
        />
      )}
    />
  )
}
