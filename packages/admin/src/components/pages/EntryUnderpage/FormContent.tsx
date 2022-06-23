import FieldMapper, { prepareFieldsForMapper } from '@components/FieldMapper'
import useCurrentModel from '@hooks/useCurrentModel'
import { ColumnType, ModelColumnName } from '@prom-cms/shared'
import { forwardRef, MutableRefObject, RefObject, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useEntryUnderpageContext } from '.'
import { ItemFormValues } from './types'
import type EditorJS from '@editorjs/editorjs'
import { BlockEditor } from '@components/form/BlockEditor'

export const FormContent = forwardRef<{ editorRef: RefObject<EditorJS> }, {}>(
  function FormContent(_, refs) {
    // We recieve multiple refs and destructure them
    const { editorRef } =
      (refs as MutableRefObject<{ editorRef: RefObject<EditorJS> }>)?.current ||
      {}
    const { currentView, itemData } = useEntryUnderpageContext()
    const { formState } = useFormContext<ItemFormValues>()
    const model = useCurrentModel()

    const groupedFields = useMemo<
      Array<ColumnType & { columnName: ModelColumnName }>[] | undefined
    >(() => {
      if (!model) return

      return prepareFieldsForMapper(model)
    }, [model])

    if (!groupedFields) return null

    return (
      <div className="flex min-h-screen flex-col gap-5">
        {model?.admin?.layout === 'simple' ? (
          groupedFields && <FieldMapper fields={groupedFields} />
        ) : (
          <BlockEditor
            initialValue={itemData?.content}
            autofocus={currentView === 'update'}
            ref={editorRef}
          />
        )}
        {formState.isSubmitting && (
          <div className="absolute inset-0 cursor-progress bg-white/20 backdrop-blur-[2px]" />
        )}
      </div>
    )
  }
)
