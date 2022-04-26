import { User, UserRoles } from '@prom-cms/shared'
import { useMemo, VFC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useData } from './context'
import FieldMapper, { prepareFieldsForMapper } from '@components/FieldMapper'
import { useGlobalContext } from '@contexts/GlobalContext'
import unset from 'lodash/unset'

export const UserUnderpageForm: VFC = () => {
  const { model } = useData()
  const { currentUserIsAdmin, currentUser } = useGlobalContext()
  const { formState } = useFormContext<User>()

  const groupedFields = useMemo(() => {
    if (!model) return
    const newModel = { ...model, columns: { ...model.columns } }

    if (
      newModel.columns.role &&
      !(currentUserIsAdmin || currentUser?.role === UserRoles.Maintainer)
    ) {
      unset(newModel, 'columns.role')
    }

    return prepareFieldsForMapper(newModel)
  }, [model, currentUserIsAdmin, currentUser])

  return (
    <>
      {groupedFields && <FieldMapper fields={groupedFields} />}

      {formState.isSubmitting && (
        <div className="absolute inset-0 cursor-progress bg-white/20 backdrop-blur-[2px]" />
      )}
    </>
  )
}
