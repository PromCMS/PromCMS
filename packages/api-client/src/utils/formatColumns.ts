import { ApiResultModels, ApiResultSingletons } from '../types';

export const formatColumns = <T extends ApiResultModels | ApiResultSingletons>(
  models: T
) => {
  const result = new Map<string, T[keyof T]>(Object.entries(models));

  for (const [modelKey, modelInfo] of result) {
    result.set(modelKey, modelInfo);
  }

  return Object.fromEntries(result) as Record<keyof T, T[keyof T]>;
};
