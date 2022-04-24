import useCurrentModel from '@hooks/useCurrentModel'
import useCurrentModelItem from '@hooks/useCurrentModelItem'
import { ApiResultItem } from '@prom-cms/shared'
import { EntryService } from '@services'
import { useRouter } from 'next/router'
import { createContext, FC, useContext } from 'react'
import { EntryTypeUrlActionType } from '@custom-types'
import { KeyedMutator } from 'swr'
import { useMemo } from 'react'

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

  // Unset id because of duplication
  // TODO we should handle this better via third viewType
  const updatedItemData = useMemo(() => {
    if (itemData && viewType === 'create') {
      const { id, ...restItemData } = itemData
      return restItemData
    }

    return itemData
  }, [itemData, viewType])

  return (
    <EntryUnderpageContext.Provider
      value={{
        currentView: viewType,
        exitView: () => {
          push(EntryService.getListUrl(currentModel?.name as string))
        },
        itemData: updatedItemData as ApiResultItem,
        itemIsError,
        itemIsLoading,
        itemIsMissing,
      }}
    >
      {children}
    </EntryUnderpageContext.Provider>
  )
}
