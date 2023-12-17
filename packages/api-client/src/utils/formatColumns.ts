import { ApiResultModels, ApiResultSingletons } from '../types';

export const formatColumns = <T extends ApiResultModels | ApiResultSingletons>(
  models: T
) => {
  const result = new Map<string, T[keyof T]>(Object.entries(models));

  for (const [modelKey, modelInfo] of result) {
    const columns = new Map<string, (typeof modelInfo.columns)[number]>(
      modelInfo.columns.map((column) => [column.name, column])
    );

    for (const [columnKey, columnInfo] of columns) {
      if (columnInfo.type === 'json') {
        if (columnInfo.admin?.fieldType === 'repeater') {
          columns.set(columnKey, {
            ...columnInfo,
            admin: {
              ...columnInfo.admin,
              columns: columnInfo.admin.columns,
            },
          });
        }
      }
    }

    result.set(modelKey, {
      ...modelInfo,
      columns,
    });
  }

  return Object.fromEntries(result) as Record<keyof T, T[keyof T]>;
};
