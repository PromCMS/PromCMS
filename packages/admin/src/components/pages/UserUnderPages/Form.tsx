import { User } from '@prom-cms/shared'
import { useMemo, VFC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useData } from './context'
import FieldMapper, { prepareFieldsForMapper } from '@components/FieldMapper'

export const UserUnderpageForm: VFC = () => {
  const { model } = useData()
  const { formState } = useFormContext<User>()

  const groupedFields = useMemo(() => {
    if (!model) return

    return prepareFieldsForMapper(model)
  }, [model])

  return (
    <>
      {groupedFields && <FieldMapper fields={groupedFields} />}

      {formState.isSubmitting && (
        <div className="absolute inset-0 cursor-progress bg-white/20 backdrop-blur-[2px]" />
      )}
    </>
  )
}
