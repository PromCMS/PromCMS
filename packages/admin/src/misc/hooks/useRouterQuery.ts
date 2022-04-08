import { useRouter } from 'next/router'

export const useRouterQuery = (name: string) => {
  const { query } = useRouter()
  return query[name]
}
