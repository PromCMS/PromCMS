import { useMemo } from 'react'
import { useModelInfo, useRouterQuery } from '.'

/**
 * Quick hook to access current model information on current route.
 * @returns A current model (taken from url) information if that modelId exists
 */
const useCurrentModel = () => {
  const modelName = useRouterQuery('modelId')
  const formattedModelName = useMemo(
    () => String(modelName).toLowerCase(),
    [modelName]
  )
  const modelInfo = useModelInfo(formattedModelName)

  return useMemo(
    () => (modelInfo ? { ...modelInfo, name: formattedModelName } : undefined),
    [formattedModelName, modelInfo]
  )
}

export default useCurrentModel
