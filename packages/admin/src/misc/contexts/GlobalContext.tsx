import { ApiResultModels, User } from '@prom-cms/shared'
import axios from 'axios'
import { apiClient } from '@api'
import { API_CURRENT_USER_URL, API_ENTRY_TYPES_URL } from '@constants'
import { useRouter } from 'next/router'
import { createContext, FC, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface IGlobalContext {
  currentUser?: User
  models?: ApiResultModels
  updateValue<T extends keyof Omit<IGlobalContext, 'updateValue'>>(
    key: T,
    value?: IGlobalContext[T]
  ): void
  isBooting: boolean
  isLoggedIn: boolean
}

export const GlobalContext = createContext<IGlobalContext>({
  updateValue: () => {},
  isBooting: true,
  isLoggedIn: false,
})

export const GlobalContextProvider: FC = ({ children }) => {
  const { push, pathname } = useRouter()
  const { t, i18n } = useTranslation()
  const [currentUser, setCurrentUser] = useState<User>()
  const [models, setModels] = useState()
  const [isBooting, setIsBooting] = useState(true)
  const [isNotOnline, setIsNotOnline] = useState(false)

  const updateValue: IGlobalContext['updateValue'] = (key, value) => {
    switch (key) {
      case 'currentUser':
        // @ts-ignore
        setCurrentUser(value)
        break
      case 'models':
        // @ts-ignore
        setModels(value)
        break
      default:
        console.error(`Key ${key} does not exist in global context`)
        break
    }
  }

  useEffect(() => {
    const cancelToken = axios.CancelToken.source()

    const getModels = async () => {
      setIsBooting(true)
      const modelsQuery = await apiClient.get(API_ENTRY_TYPES_URL, {
        cancelToken: cancelToken.token,
      })

      setModels(modelsQuery.data)
      setIsBooting(false)
    }

    if (!!currentUser && !models) {
      getModels()
    }

    return () => cancelToken.cancel()
  }, [currentUser, push, models])

  useEffect(() => {
    const cancelToken = axios.CancelToken.source()

    const getUser = async () => {
      try {
        const currentUserQuery = await apiClient.get(API_CURRENT_USER_URL, {
          cancelToken: cancelToken.token,
        })

        setCurrentUser(currentUserQuery.data.data)

        setIsBooting(false)
      } catch (e) {
        if (axios.isAxiosError(e)) {
          if (e.response?.status === 401) {
            // TODO: Apply first url to login page so we can then take user to that page
            // User is not logged in so kick him to login page
            if (
              !pathname.includes('/login') &&
              !pathname.includes('/reset-password')
            )
              await push('/login')
          } else {
            // TODO: Make this a better message to some component/page
            alert('Looks like API is not working, please tell your developer')
          }
          setIsBooting(false)
        }
      }
    }

    if (!currentUser) {
      getUser()
    }

    return () => cancelToken.cancel()
  }, [currentUser, push])

  useEffect(() => {
    // TODO
    const onOnline = () => setIsNotOnline(false)
    const onOffline = () => setIsNotOnline(true)

    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [setIsNotOnline])

  useEffect(() => {
    const listener = () => {
      setCurrentUser(undefined)
    }
    if (currentUser) {
      window.addEventListener('userHasBeenLoggedOff', listener)
    }

    return () => {
      window.removeEventListener('userHasBeenLoggedOff', listener)
    }
  }, [setCurrentUser, currentUser])

  return (
    <GlobalContext.Provider
      value={{
        models,
        currentUser,
        updateValue,
        isBooting: isBooting || !i18n.isInitialized,
        isLoggedIn: !!currentUser,
      }}
    >
      {children}
      {isNotOnline && (
        <div className="absolute inset-0 bg-white">
          <p className="m-auto">
            {t("It appears that you're not online, try again later...")}
          </p>
        </div>
      )}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => useContext(GlobalContext)
