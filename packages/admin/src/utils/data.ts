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
      show: !(columnInfo.hide ?? false),
      ...(columnInfo.type === 'json' && {
        formatter() {
          return 'text'
        },
      }),
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
    if (newValue !== oldValue) {
      diffedResult[entryKey] = newValue
    }
  })

  return diffedResult
}

export const modelIsCustom = (modelName: string) =>
  CUSTOM_MODELS.includes(modelName.toLowerCase())
