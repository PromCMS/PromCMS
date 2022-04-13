import FieldMapper, { prepareFieldsForMapper } from '@components/FieldMapper'
import { BlockEditor } from '@components/form/BlockEditor'
import useCurrentModel from '@hooks/useCurrentModel'
import { ColumnType, ModelColumnName } from '@prom-cms/shared'
import { useMemo, VFC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useEntryUnderpageContext } from '.'
import { ItemFormValues } from './types'

export interface FormProps {
  isLoading?: boolean
}

export const EntryUnderpageForm: VFC<FormProps> = ({}) => {
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
    <>
      {model?.admin?.layout === 'simple' ? (
        groupedFields && <FieldMapper fields={groupedFields} />
      ) : (
        <BlockEditor
          initialValue={itemData?.content}
          autofocus={currentView === 'update'}
        />
      )}
      {formState.isSubmitting && (
        <div className="absolute inset-0 cursor-progress bg-white/20 backdrop-blur-[2px]" />
      )}
    </>
  )
}
