import { useGlobalContext } from '@contexts/GlobalContext'
import { ApiResultModel } from '@prom-cms/shared'

export const useModelInfo = <T extends ApiResultModel | undefined>(
  modelName: string
): T => {
  const { models } = useGlobalContext()
  return (models && models[modelName]) as T
}
