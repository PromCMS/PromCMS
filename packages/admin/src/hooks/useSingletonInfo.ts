import { useEntities } from '@contexts/EntitiesContext';
import { useMemo } from 'react';

import { ApiResultModelSingleton } from '@prom-cms/api-client';

export const useSingletonInfo = <T extends ApiResultModelSingleton | undefined>(
  name: string
): T => {
  const { singletons } = useEntities();
  return useMemo(
    () => (singletons && singletons[name]) as T,
    [name, singletons]
  );
};
