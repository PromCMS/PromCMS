import { ApiResultModel, ApiResultModelSingleton } from '@prom-cms/api-client';
import { FieldPlacements } from '@prom-cms/schema';

export const prepareFieldsForMapper = (
  { columns }: ApiResultModel | ApiResultModelSingleton,
  placement?: FieldPlacements
) => {
  const fields: (typeof columns)[number][] = [];

  for (const column of columns) {
    const columnWithFieldName = column as typeof column & {
      columnName?: string;
    };

    const { hide, admin } = columnWithFieldName;

    if (
      hide ||
      (placement && admin?.editor?.placement !== placement) ||
      columnWithFieldName.admin.isHidden ||
      column.name === 'published' ||
      column.name === 'coeditors'
    ) {
      continue;
    }

    fields.push(
      columnWithFieldName as typeof columnWithFieldName & { columnName: string }
    );
  }

  return fields;
};
