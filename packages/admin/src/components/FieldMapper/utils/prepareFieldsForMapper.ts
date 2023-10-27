import { FieldPlacements } from '@prom-cms/schema';
import { ApiResultModel, ApiResultModelSingleton } from '@prom-cms/shared';

export const prepareFieldsForMapper = (
  { columns }: ApiResultModel | ApiResultModelSingleton,
  placement?: FieldPlacements
) => {
  const fields: (ReturnType<(typeof columns)['get']> & {
    columnName: string;
  })[] = [];

  for (const [columnName, column] of columns) {
    const columnWithFieldName = column as typeof column & {
      columnName?: string;
    };

    const { hide, editable, admin } = columnWithFieldName;

    if (
      hide ||
      !editable ||
      (placement && admin?.editor?.placement !== placement) ||
      columnWithFieldName.admin.isHidden ||
      columnName === 'is_published' ||
      columnName === 'coeditors'
    ) {
      continue;
    }

    columnWithFieldName.columnName = columnName;

    fields.push(
      columnWithFieldName as typeof columnWithFieldName & { columnName: string }
    );
  }

  return fields;
};
