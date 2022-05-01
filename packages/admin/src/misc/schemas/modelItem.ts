import type { ApiResultModel } from '@prom-cms/shared'
import { convertColumnTypeToPrimitive } from '@prom-cms/shared'
import * as yup from 'yup'

export const getModelItemSchema = (
  /**
   * config to read from
   */
  config: ApiResultModel,
  /**
   * If required logic should be included, useful when you want to return schema for update query
   */
  ignoreRequired?: boolean
) => {
  const { columns } = config

  const yupShape = Object.keys(columns)
    .filter((columnKey) => !columns[columnKey].hide)
    .reduce((shape, columnKey) => {
      const column = columns[columnKey]
      let columnShape

      if (column.type === 'file') {
        columnShape = yup[
          convertColumnTypeToPrimitive(column.type)
        ]().transform((value, originalValue) => {
          return typeof originalValue === 'object'
            ? Number(originalValue.id)
            : Number(originalValue)
        })
      } else {
        columnShape =
          column.type === 'enum'
            ? yup.mixed().oneOf(column.enum)
            : yup[convertColumnTypeToPrimitive(column.type)]()

        if (column.required && !ignoreRequired) {
          columnShape = columnShape.required('This is a required field.')
        } else {
          columnShape = columnShape.nullable().notRequired()
        }
      }

      shape[columnKey] = columnShape

      return shape
    }, {} as Record<string, any>)

  return yup.object().shape(yupShape).noUnknown()
}
