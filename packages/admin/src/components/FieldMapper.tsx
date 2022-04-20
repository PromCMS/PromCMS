import { Select, SelectItem, Textarea, TextInput } from '@mantine/core'
import {
  ApiResultModel,
  ModelColumnName,
  ColumnType,
  capitalizeFirstLetter,
  EnumColumnType,
} from '@prom-cms/shared'
import { useMemo, VFC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export interface FieldMapperProps {
  fields: (ColumnType & {
    columnName: ModelColumnName
  })[][]
}

const CustomSelect: VFC<
  EnumColumnType & {
    columnName: ModelColumnName
    error: string
  }
> = ({ columnName, title, error, enum: enumValue }) => {
  const { t } = useTranslation()

  const enumValues = useMemo<SelectItem[]>(
    () =>
      enumValue.map((enumKey) => ({
        value: enumKey,
        label: t(capitalizeFirstLetter(enumKey)),
      })),
    [enumValue, t]
  )

  return (
    <>
      <Controller
        name={columnName}
        render={({ field: { onChange, value } }) => (
          <Select
            data={enumValues}
            key={columnName}
            label={title}
            value={value}
            onChange={onChange}
            className="w-full"
            placeholder={t('Select an option')}
            shadow="xl"
            error={error}
          />
        )}
      />
    </>
  )
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
              const errorMessage = t(
                formState.errors[columnName]?.message || ''
              )

              if (type === 'string' || type === 'number')
                return (
                  <TextInput
                    key={columnName}
                    label={title}
                    type={type === 'string' ? 'text' : type}
                    className="w-full"
                    autoComplete="off"
                    error={errorMessage}
                    {...register(columnName)}
                  />
                )
              else if (type === 'longText') {
                return (
                  <Textarea
                    autosize
                    minRows={7}
                    key={columnName}
                    label={title}
                    className="w-full"
                    error={errorMessage}
                    {...register(columnName)}
                  />
                )
              } else if (type === 'enum') {
                return (
                  <CustomSelect
                    key={columnName}
                    error={errorMessage}
                    {...values}
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
