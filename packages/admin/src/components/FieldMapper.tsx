import {
  ApiResultModel,
  ModelColumnName,
  ColumnType,
  capitalizeFirstLetter,
} from '@prom-cms/shared'
import { VFC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Input from './form/Input'
import { Select } from './form/Select'
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
            {rowItems.map((values) => {
              const { title, type, columnName } = values

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
              } else if (type === 'enum') {
                return (
                  <Select
                    key={columnName}
                    label={title}
                    className="w-full"
                    error={t(formState.errors[columnName]?.message || '')}
                    options={values.enum.map((enumKey) => [
                      enumKey,
                      t(capitalizeFirstLetter(enumKey)),
                    ])}
                    emptyPlaceholder={t('Select an option')}
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
