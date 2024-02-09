import { useEntities } from '@contexts/EntitiesContext';
import { useMemo } from 'react';

import { ApiResultModel } from '@prom-cms/api-client';

export const useModelInfo = <T extends ApiResultModel | undefined>(
  modelName: string
): T => {
  const { models } = useEntities();

  const value = useMemo(
    () => (models && models[modelName]) as T,
    [modelName, models]
  );

  return value;
};
