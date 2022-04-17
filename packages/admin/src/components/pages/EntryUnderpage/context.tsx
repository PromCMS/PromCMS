import useCurrentModel from '@hooks/useCurrentModel'
import useCurrentModelItem from '@hooks/useCurrentModelItem'
import { ApiResultItem } from '@prom-cms/shared'
import { EntryService } from '@services'
import { useRouter } from 'next/router'
import { createContext, FC, useContext } from 'react'
import { EntryTypeUrlActionType } from '@custom-types'
import { KeyedMutator } from 'swr'

export interface IEntryUnderpageContext {
  currentView: EntryTypeUrlActionType
  exitView: () => void
  itemIsError: boolean
  itemIsLoading: boolean
  itemData?: ApiResultItem | undefined
  itemIsMissing: boolean
}

export const EntryUnderpageContext = createContext<IEntryUnderpageContext>({
  exitView: () => {},
  currentView: 'update',
  itemIsMissing: false,
  itemIsLoading: true,
  itemIsError: false,
})

export const useEntryUnderpageContext = () => useContext(EntryUnderpageContext)

export const EntryUnderpageContextProvider: FC<{
  viewType: EntryTypeUrlActionType
}> = ({ children, viewType }) => {
  const { push } = useRouter()
  const currentModel = useCurrentModel()
  const {
    data: itemData,
    isError: itemIsError,
    isLoading: itemIsLoading,
    itemIsMissing,
  } = useCurrentModelItem()

  return (
    <EntryUnderpageContext.Provider
      value={{
        currentView: viewType,
        exitView: () => {
          push(EntryService.getListUrl(currentModel?.name as string))
        },
        itemData,
        itemIsError,
        itemIsLoading,
        itemIsMissing,
      }}
    >
      {children}
    </EntryUnderpageContext.Provider>
  )
}
