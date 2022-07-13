import { useGlobalContext } from '@contexts/GlobalContext'
import { ApiResultModel } from '@prom-cms/shared'
import { useMemo } from 'react'

export const useModelInfo = <T extends ApiResultModel | undefined>(
  modelName: string
): T => {
  const { models } = useGlobalContext()
  return useMemo(() => (models && models[modelName]) as T, [modelName, models])
}
