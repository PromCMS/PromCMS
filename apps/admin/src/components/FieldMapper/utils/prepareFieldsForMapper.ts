import { ApiResultModel } from '@prom-cms/shared';

export const prepareFieldsForMapper = (model: ApiResultModel) =>
  Object.keys(model.columns)
    .map((columnName: string) => [
      {
        ...model.columns[columnName],
        columnName,
      },
    ])
    .filter(
      (items) => items.filter(({ hide, editable }) => !hide && editable).length
    )
    .map((items) => items.filter((item) => item.columnName !== 'is_published'));
