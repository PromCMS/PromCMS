import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { ApiResultModelSingleton } from '@prom-cms/api-client';

import { useSingletonInfo } from './useSingletonInfo';

export type RichApiResultModelSingleton = ApiResultModelSingleton & {
  key: string;
};

/**
 * Quick hook to access current singleton information on current route.
 * @returns A current model (taken from url) information if that singletonId exists
 */
const useCurrentSingleton = <T extends boolean>(
  // @ts-ignore
  strict: T = false
) => {
  const { singletonId } = useParams();
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