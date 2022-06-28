import { Textarea, TextInput } from '@mantine/core'
import { ModelColumnName, ColumnType } from '@prom-cms/shared'
import { VFC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ImageSelect from '../form/ImageSelect'
import { EnumSelect, RelationshipItemSelect } from './fields'

export interface FieldMapperProps {
  fields: (ColumnType & {
    columnName: ModelColumnName
  })[][]
}

const FieldMapper: VFC<FieldMapperProps> = ({ fields }) => {
  const { formState, register, control } = useFormContext()
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
                  <EnumSelect
                    key={columnName}
                    error={errorMessage}
                    {...values}
                  />
                )
              } else if (type === 'relationship') {
                return (
                  <RelationshipItemSelect
                    key={columnName}
                    error={errorMessage}
                    {...values}
                  />
                )
              } else if (type === 'file') {
                return (
                  <Controller
                    key={columnName}
                    control={control}
                    name={columnName}
                    render={({ field: { onChange, value } }) => (
                      <ImageSelect
                        onChange={onChange}
                        selected={value}
                        error={errorMessage}
                        label={values.title}
                        {...values}
                      />
                    )}
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
