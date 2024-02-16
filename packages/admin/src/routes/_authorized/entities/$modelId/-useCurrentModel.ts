import { useModelInfo } from '@hooks/useModelInfo';
import { useParams } from '@tanstack/react-router';
import { useMemo } from 'react';

import { ApiResultModel } from '@prom-cms/api-client';

import { EntityMainPageRoute } from './index';

export type RichApiResultModel = ApiResultModel & {
  name: string;
};

/**
 * Quick hook to access current model information on current route.
 * @returns A current model (taken from url) information if that modelId exists
 */
const useCurrentModel = <T extends boolean>(
  // @ts-ignore
  strict: T = false
) => {
  const { modelId } = useParams({
    from: EntityMainPageRoute.id,
  });
  const formattedModelName = useMemo(() => String(modelId), [modelId]);
  const modelInfo = useModelInfo(formattedModelName);

  if (strict && !modelInfo) {
    throw new Error('Model not found');
  }

  return useMemo(
    () => (modelInfo ? { ...modelInfo, name: formattedModelName } : undefined),
    [formattedModelName, modelInfo]
  ) as T extends false ? RichApiResultModel | undefined : RichApiResultModel;
};

export default useCurrentModel;
