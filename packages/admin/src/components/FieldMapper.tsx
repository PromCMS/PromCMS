import { ApiResultModel, ModelColumnName, ColumnType } from '@prom-cms/shared'
import { VFC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Input from './form/Input'
import Textarea from './form/Textarea'

export interface FieldMapperProps {
  fields: (ColumnType & {
    columnName: ModelColumnName
  })[][]
}

export const prepareFieldsForMapper = (model: ApiResultModel) =>
  Object.keys(model.columns)
    .map((columnName: ModelColumnName) => [
      {
        ...model.columns[columnName],
        columnName,
      },
    ])
    .filter(
      (items) => items.filter(({ hide, editable }) => !hide && editable).length
    )

const FieldMapper: VFC<FieldMapperProps> = ({ fields }) => {
  const { formState, register } = useFormContext()
  const { t } = useTranslation()

  return (
    <>
      {fields.map((rowItems, rowIndex) =>
        rowItems.length ? (
          <div key={rowIndex} className="grid w-full gap-5">
            {rowItems.map(({ title, type, columnName }) => {
              if (type === 'string' || type === 'number')
                return (
                  <Input
                    key={columnName}
                    label={title}
                    type={type === 'string' ? 'text' : type}
                    className="w-full"
                    autoComplete="off"
                    touched={formState.touchedFields[columnName]}
                    error={t(formState.errors[columnName]?.message || '')}
                    {...register(columnName)}
                  />
                )
              else if (type === 'longText') {
                return (
                  <Textarea
                    rows={8}
                    key={columnName}
                    label={title}
                    className="w-full"
                    touched={formState.touchedFields[columnName]}
                    error={t(formState.errors[columnName]?.message || '')}
                    {...register(columnName)}
                  />
                )
              }
            })}
          </div>
        ) : null
      )}
    </>
  )
}

export default FieldMapper
