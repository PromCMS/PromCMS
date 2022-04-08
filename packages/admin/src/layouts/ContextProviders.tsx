import { GlobalContextProvider } from '@contexts/GlobalContext'
import { apiClient } from '@api'
import { FC } from 'react'
import { SWRConfig } from 'swr'

const ContextProviders: FC = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher: (url) => apiClient.get(url).then((res) => res.data.data),
      }}
    >
      <GlobalContextProvider>{children}</GlobalContextProvider>
    </SWRConfig>
  )
}

export default ContextProviders
