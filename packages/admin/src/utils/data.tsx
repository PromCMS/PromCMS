import { TableViewCol } from '@components/TableView'
import { DatabaseConfigModel } from '@prom-cms/shared'
import { CUSTOM_MODELS } from '@constants'
import isEqual from 'lodash/isEqual'
import { iconSet } from '@prom-cms/icons'

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
        columnInfo.adminHidden ||
        false
      ),
      // TODO make new formatter
      /*...(columnInfo.type === 'json' && {
        formatter(value) {
          return JSON.stringify(value || {})
        },
      }),*/
      ...(columnInfo.type === 'boolean' && {
        formatter(values) {
          return values[columnKey] ? (
            <iconSet.Check className="text-green-400" />
          ) : (
            <iconSet.X className="text-red-400" />
          )
        },
      }),
    }
  })

export const getObjectDiff = (
  originalObject: any,
  newObject: Record<any, any>
) => {
  const diffedResults: Record<any, any> = {}

  Object.keys(newObject).forEach((entryKey) => {
    const newValue = newObject[entryKey]
    const oldValue = originalObject[entryKey]

    if (!isEqual(newValue, oldValue)) {
      diffedResults[entryKey] = newValue
    }
  })

  return diffedResults
}

export const modelIsCustom = (modelName: string) =>
  CUSTOM_MODELS.includes(modelName)

export const generateUuid = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2)
