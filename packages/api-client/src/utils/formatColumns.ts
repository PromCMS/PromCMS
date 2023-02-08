import { ApiResultModels, ApiResultSingletons } from '@prom-cms/shared';

export const formatColumns = <T extends ApiResultModels | ApiResultSingletons>(
  models: T
) => {
  const result = new Map<keyof T, T[keyof T]>(Object.entries(models));

  for (const [modelKey, modelInfo] of result) {
    const columns = new Map<
      Parameters<typeof modelInfo.columns.get>['0'],
      NonNullable<ReturnType<typeof modelInfo.columns.get>>
    >(Object.entries(modelInfo.columns || {}) as any);

    for (const [columnKey, columnInfo] of columns) {
      if (columnInfo.type === 'json') {
        if (columnInfo.admin?.fieldType === 'repeater') {
          columns.set(columnKey, {
            ...columnInfo,
            admin: {
              ...columnInfo.admin,
              columns: new Map(Object.entries(columnInfo.admin.columns)),
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
