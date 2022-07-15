import { User } from '@prom-cms/shared'
import { useMemo, VFC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useData } from './context'
import FieldMapper, { prepareFieldsForMapper } from '@components/FieldMapper'
import unset from 'lodash/unset'
import { useCurrentUser } from '@hooks/useCurrentUser'

export const UserUnderpageForm: VFC = () => {
  const { model } = useData()
  const currentUser = useCurrentUser()
  const { formState } = useFormContext<User>()

  const groupedFields = useMemo(() => {
    if (!model) return
    const newModel = { ...model, columns: { ...model.columns } }

    if (
      newModel.columns.role &&
      !currentUser?.can({ action: 'update', targetModel: 'users' })
    ) {
      unset(newModel, 'columns.role')
    }

    return prepareFieldsForMapper(newModel)
  }, [model, currentUser])

  return (
    <>
      {groupedFields && <FieldMapper fields={groupedFields} />}

      {formState.isSubmitting && (
        <div className="absolute inset-0 cursor-progress bg-white/20 backdrop-blur-[2px]" />
      )}
    </>
  )
}
