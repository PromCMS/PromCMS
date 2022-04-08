import { ItemID } from '@prom-cms/shared'
import { createContext, useContext, useReducer } from 'react'

type ContextReadonlyKeys = Omit<ISmallFileListContext, 'updateValues'>

export interface ISmallFileListContext {
  currentPath: string
  selectedFiles: ItemID[]
  updateValue: <T extends keyof ContextReadonlyKeys>(config: {
    name: T
    value: ISmallFileListContext[T]
  }) => void
}

function reducer<T extends keyof ISmallFileListContext>(
  state: ContextReadonlyKeys,
  {
    name,
    value,
  }: {
    name: T
    value: ISmallFileListContext[T]
  }
) {
  return { ...state, [name]: value }
}

const initialValues: ISmallFileListContext = {
  currentPath: '/',
  selectedFiles: [],
  updateValue: () => {},
}

export const useSmallFileListContextReducer = () =>
  useReducer(reducer, initialValues)

export const SmallFileListContext =
  createContext<ISmallFileListContext>(initialValues)

export const useSmallFileList = () => useContext(SmallFileListContext)
