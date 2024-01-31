import { useGlobalContext } from 'contexts/GlobalContext';
import { useMemo } from 'react';

import { ApiResultModel } from '@prom-cms/api-client';

export const useModelInfo = <T extends ApiResultModel | undefined>(
  modelName: string
): T => {
  const { models } = useGlobalContext();
  return useMemo(() => (models && models[modelName]) as T, [modelName, models]);
};
