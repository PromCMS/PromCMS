import { ApiResultModel, FieldPlacements } from '@prom-cms/shared';

export const prepareFieldsForMapper = (
  model: ApiResultModel,
  placement?: FieldPlacements
) =>
  Object.keys(model.columns)
    .map((columnName: string) => [
      {
        ...model.columns[columnName],
        columnName,
      },
    ])
    .filter(
      (columns) =>
        columns.filter(
          ({ hide, editable, admin }) =>
            !hide &&
            editable &&
            (placement ? admin.editor.placement === placement : true)
        ).length
    )
    .map((items) => items.filter((item) => item.columnName !== 'is_published'));
