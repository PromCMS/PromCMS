import { useGlobalContext } from '@contexts/GlobalContext';
import { ApiResultModelSingleton } from '@prom-cms/shared';
import { useMemo } from 'react';

export const useSingletonInfo = <T extends ApiResultModelSingleton | undefined>(
  name: string
): T => {
  const { singletons } = useGlobalContext();
  return useMemo(
    () => (singletons && singletons[name]) as T,
    [name, singletons]
  );
};
