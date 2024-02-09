import { useParams } from '@tanstack/react-router';
import { useMemo } from 'react';

import { ApiResultModelSingleton } from '@prom-cms/api-client';

import { SingletonUnderpageRoute } from '../routes/_authorized/entities/singletons/$singletonId';
import { useSingletonInfo } from './useSingletonInfo';

export type RichApiResultModelSingleton = ApiResultModelSingleton & {
  key: string;
};

console.log({ SingletonUnderpageRoute });

/**
 * Quick hook to access current singleton information on current route.
 * @returns A current model (taken from url) information if that singletonId exists
 */
export const useCurrentSingleton = <T extends boolean>(
  // @ts-ignore
  strict: T = false
) => {
  const { singletonId } = useParams({ from: SingletonUnderpageRoute.id });
  const formattedModelName = useMemo(() => String(singletonId), [singletonId]);
  const modelInfo = useSingletonInfo(formattedModelName);

  if (strict && !modelInfo) {
    throw new Error('Model not found');
  }

  return useMemo(
    () => (modelInfo ? { ...modelInfo, key: formattedModelName } : undefined),
    [formattedModelName, modelInfo]
  ) as T extends false
    ? RichApiResultModelSingleton | undefined
    : RichApiResultModelSingleton;
};

export default useCurrentSingleton;
