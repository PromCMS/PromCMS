import { apiClient } from '@api';
import { API_CURRENT_USER_URL, API_SETTINGS_URL } from '@constants';
import { Alert, Dialog, Text } from '@mantine/core';
import axios, { CanceledError } from 'axios';
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { ItemID, User, UserRole } from '@prom-cms/api-client';

type DataFromAxios<T extends (...any) => Promise<Record<any, any>>> = Awaited<
  ReturnType<T>
>['data'];

export interface IGlobalContext {
  currentUser?: Omit<User, 'role'> & { role: UserRole };
  models?: DataFromAxios<typeof apiClient.entries.getInfo>;
  singletons?: DataFromAxios<typeof apiClient.singletons.getInfo>;
  updateValue<T extends keyof Omit<IGlobalContext, 'updateValue'>>(
    key: T,
    value?: IGlobalContext[T]
  ): void;
  currentUserIsAdmin: boolean;
  isBooting: boolean;
  isLoggedIn: boolean;
  settings?: {
    i18n: { default: string; languages: string[] };
    app: { name: string; url: string; prefix: string; baseUrl: string };
  };
}

export const GlobalContext = createContext<IGlobalContext>({
  updateValue: () => {},
  currentUserIsAdmin: false,
  isBooting: true,
  isLoggedIn: false,
});

export const GlobalContextProvider: FC<PropsWithChildren> = ({ children }) => {
  let navigate = useNavigate();
  let { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const [currentUser, setCurrentUser] = useState<
    Omit<User, 'role'> & { role: UserRole }
  >();
  const [models, setModels] = useState<IGlobalContext['models']>();
  const [singletons, setSingletons] = useState<IGlobalContext['singletons']>();
  const [isBooting, setIsBooting] = useState(true);
  const [isNotOnline, setIsNotOnline] = useState(false);
  const [settings, setSettings] = useState();

  const updateValue: IGlobalContext['updateValue'] = (key, value) => {
    switch (key) {
      case 'currentUser':
        // @ts-ignore
        setCurrentUser(value);
        break;
      case 'models':
        // @ts-ignore
        setModels(value);
        break;
      default:
        console.error(`Key ${key} does not exist in global context`);
        break;
    }
  };

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    const getModels = async () => {
      setIsBooting(true);
      const [modelsQuery, settingsRes, singletonsRes] = await Promise.all([
        apiClient.entries.getInfo({ cancelToken: cancelToken.token }),
        apiClient.getAxios().get(API_SETTINGS_URL, {
          cancelToken: cancelToken.token,
        }),
        apiClient.singletons.getInfo({ cancelToken: cancelToken.token }),
      ]);

      setSettings(settingsRes.data.data);
      setSingletons(singletonsRes.data);
      setModels(modelsQuery.data);
      setIsBooting(false);
    };

    if (!!currentUser && !models) {
      getModels();
    }

    return () => cancelToken.cancel();
  }, [currentUser, navigate, models]);

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    const getUser = async () => {
      setIsBooting(true);
      try {
        const loggedInUserQuery = await apiClient
          .getAxios()
          .get(API_CURRENT_USER_URL, {
            cancelToken: cancelToken.token,
          });

        const loggedInUser = loggedInUserQuery.data.data as User;
        const currentUserRoleQuery = await apiClient.userRoles.getOne(
          loggedInUser.role as ItemID
        );

        setCurrentUser({
          ...loggedInUser,
          role: currentUserRoleQuery.data.data,
        });

        setIsBooting(false);
      } catch (e) {
        if (e instanceof CanceledError) {
          return;
        }

        if (axios.isAxiosError(e)) {
          if (e.response?.status === 401) {
            // TODO: Apply first url to login page so we can then take user to that page
            // User is not logged in so kick him to login page
            if (
              !pathname.includes('/login') &&
              !pathname.includes('/reset-password') &&
              !pathname.includes('/finalize-registration')
            )
              await navigate('/login');
          } else {
            // TODO: Make this a better message to some component/page
            alert('Looks like API is not working, please tell your developer');
          }

          setIsBooting(false);
        }
      }
    };

    if (!currentUser) {
      getUser();
    }

    return () => cancelToken.cancel();
  }, [currentUser, navigate]);

  useEffect(() => {
    // TODO
    const onOnline = () => setIsNotOnline(false);
    const onOffline = () => setIsNotOnline(true);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [setIsNotOnline]);

  useEffect(() => {
    const listener = () => {
      setCurrentUser(undefined);
    };
    if (currentUser) {
      window.addEventListener('userHasBeenLoggedOff', listener);
    }

    return () => {
      window.removeEventListener('userHasBeenLoggedOff', listener);
    };
  }, [setCurrentUser, currentUser]);

  const contextValue = useMemo(
    () => ({
      models,
      singletons,
      currentUser,
      updateValue,
      isBooting: isBooting || !i18n.isInitialized,
      currentUserIsAdmin: !!(currentUser?.role.slug === 'admin'),
      isLoggedIn: !!currentUser,
      settings,
    }),
    [currentUser, i18n.isInitialized, isBooting, models, singletons, settings]
  );

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
      {isNotOnline ? (
        <Dialog
          opened={isNotOnline}
          size="lg"
          className="rounded-prom bg-orange-100"
        >
          <Text size="md" mb="xs" fw={500} className="text-orange-700">
            💬 {t('Network connection has been lost')}
          </Text>
          <p className="text-orange-700 opacity-75">
            {t(
              "It appears that you're not online, please connect back to a network before proceeding further..."
            )}
          </p>
        </Dialog>
      ) : null}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
