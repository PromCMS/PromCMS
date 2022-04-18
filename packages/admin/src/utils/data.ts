import { TableViewCol } from '@components/TableView'
import { DatabaseConfigModel } from '@prom-cms/shared'
import { CUSTOM_MODELS } from '@constants'

export const formatApiModelResultToTableView = (
  model: DatabaseConfigModel
): TableViewCol[] =>
  Object.keys(model.columns).map((columnKey) => {
    const columnInfo = model.columns[columnKey]

    return {
      fieldName: columnKey,
      title: columnInfo.title,
      show: !(
        columnInfo.hide ||
        columnInfo.type === 'slug' ||
        columnInfo.type === 'json' ||
        false
      ),
      // TODO make new formatter
      /*...(columnInfo.type === 'json' && {
        formatter(value) {
          return JSON.stringify(value || {})
        },
      }),*/
    }
  })

export const getObjectDiff = (
  originalObject: any,
  newObject: Record<any, any>
) => {
  const diffedResult: Record<any, any> = {}

  Object.keys(newObject).forEach((entryKey) => {
    const newValue = newObject[entryKey]
    const oldValue = originalObject[entryKey]
    if (
      (typeof newValue === 'string' &&
        typeof oldValue === 'string' &&
        newValue.localeCompare(oldValue)) ||
      newValue !== oldValue
    ) {
      diffedResult[entryKey] = newValue
    }
  })

  return diffedResult
}

export const modelIsCustom = (modelName: string) =>
  CUSTOM_MODELS.includes(modelName.toLowerCase())
