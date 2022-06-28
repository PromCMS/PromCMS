import { useRouter } from 'next/router'
import { useMemo } from 'react'

export const useRouterQuery = (name: string) => {
  const { query } = useRouter()
  return useMemo(() => query[name], [query, name])
}
