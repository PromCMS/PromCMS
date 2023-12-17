import { useGlobalContext } from '@contexts/GlobalContext';
import { useMemo } from 'react';

import { ApiResultModelSingleton } from '@prom-cms/api-client';

export const useSingletonInfo = <T extends ApiResultModelSingleton | undefined>(
  name: string
): T => {
  const { singletons } = useGlobalContext();
  return useMemo(
    () => (singletons && singletons[name]) as T,
    [name, singletons]
  );
};
