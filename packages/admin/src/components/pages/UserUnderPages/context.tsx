import { useModelInfo } from '@hooks/useModelInfo'
import { useUser } from '@hooks/useUser'
import { ApiResultModel, User } from '@prom-cms/shared'
import { UserService } from '@services'
import { useRouter } from 'next/router'
import { FC, createContext, useContext } from 'react'

type View = 'create' | 'update'

export interface IContext {
  view: View
  isLoading: boolean
  exitView: () => void
  model?: ApiResultModel
  user?: User
}

export const Context = createContext<IContext>({
  view: 'create',
  isLoading: true,
  exitView: () => {},
})

export const useData = () => useContext(Context)

export const ContextProvider: FC<{ view: View }> = ({ view, children }) => {
  const { query, push } = useRouter()
  const model = useModelInfo('users') as ApiResultModel
  const currentUser = useUser(query.userId as string)
  const exitView = () => push(UserService.getListUrl())

  return (
    <Context.Provider
      value={{
        view,
        ...(currentUser.data ? { user: currentUser.data } : {}),
        isLoading: currentUser.isLoading || currentUser.isError,
        exitView,
        model,
      }}
    >
      {children}
    </Context.Provider>
  )
}
