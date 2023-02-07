import { ApiResultModels, ApiResultSingletons } from '@prom-cms/shared';

export const formatColumns = <T extends ApiResultModels | ApiResultSingletons>(
  models: T
) => {
  const result = new Map<keyof T, T[keyof T]>(Object.entries(models));

  for (const [modelKey, modelInfo] of result) {
    result.set(modelKey, {
      ...modelInfo,
      columns: new Map(Object.entries(modelInfo.columns || {})),
    });
  }

  return Object.fromEntries(result) as Record<keyof T, T[keyof T]>;
};
