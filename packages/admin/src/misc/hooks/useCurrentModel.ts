import { useModelInfo, useRouterQuery } from '.'

/**
 * Quick hook to access current model information on current route.
 * @returns A current model (taken from url) information if that modelId exists
 */
const useCurrentModel = () => {
  const modelName = useRouterQuery('modelId')
  const formattedModelName = String(modelName).toLowerCase()
  const modelInfo = useModelInfo(formattedModelName)
  if (!modelInfo) return undefined

  return { ...modelInfo, name: formattedModelName }
}

export default useCurrentModel
