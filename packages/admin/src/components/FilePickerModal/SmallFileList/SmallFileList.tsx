import { VFC } from 'react'
import { SmallFileListContext, useSmallFileListContextReducer } from './context'

export const FileFileList: VFC = () => {
  const [state, updateValue] = useSmallFileListContextReducer()

  return (
    <SmallFileListContext.Provider
      value={{ ...state, updateValue }}
    ></SmallFileListContext.Provider>
  )
}
