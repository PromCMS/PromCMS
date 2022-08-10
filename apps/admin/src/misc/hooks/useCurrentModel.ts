import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useModelInfo } from './useModelInfo';

/**
 * Quick hook to access current model information on current route.
 * @returns A current model (taken from url) information if that modelId exists
 */
const useCurrentModel = () => {
  const { modelId } = useParams();
  const formattedModelName = useMemo(() => String(modelId), [modelId]);
  const modelInfo = useModelInfo(formattedModelName);

  return useMemo(
    () => (modelInfo ? { ...modelInfo, name: formattedModelName } : undefined),
    [formattedModelName, modelInfo]
  );
};

export default useCurrentModel;
