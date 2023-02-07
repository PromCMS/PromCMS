import {
  ApiResultModel,
  ApiResultModelSingleton,
  FieldPlacements,
} from '@prom-cms/shared';

export const prepareFieldsForMapper = (
  { columns }: ApiResultModel | ApiResultModelSingleton,
  placement?: FieldPlacements
) => {
  const fieldRows: (ReturnType<typeof columns['get']> & {
    columnName: string;
  })[][] = [];

  for (const [columnName, column] of columns) {
    const { hide, editable, admin } = column;

    if (
      hide ||
      !editable ||
      (placement && admin.editor.placement !== placement) ||
      columnName === 'is_published'
    ) {
      continue;
    }

    fieldRows.push([
      // TODO: Extend this when we will support grouped fields
      {
        ...column,
        columnName,
      },
    ]);
  }

  return fieldRows;
};
