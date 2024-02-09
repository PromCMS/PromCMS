import { apiClient } from '@api';
import { API_CURRENT_USER_URL } from '@constants';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from 'react';

import { ItemID, User, UserRole } from '@prom-cms/api-client';

import { queryClient } from '../queryClient';

type LoggedUser = Omit<User, 'role'> & { role: UserRole };
export interface AuthContext {
  /**
   * Current logged in user
   */
  user: LoggedUser | null;
}

const fetchLoggedInUser: QueryFunction<LoggedUser | null, string[]> = async ({
  signal,
}) => {
  const request = await apiClient
    .getAxios()
    .get<{ data: User }>(API_CURRENT_USER_URL, {
      signal,
    })
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return undefined;
      }

      throw error;
    });

  const loggedInUser = request?.data.data;
  if (!loggedInUser) {
    return null;
  }

  const currentUserRoleQuery = await apiClient.userRoles.getOne(
    loggedInUser.role as ItemID
  );

  return {
    ...loggedInUser,
    role: currentUserRoleQuery.data.data,
  };
};

const FETCH_LOGGED_IN_USER_QUERY_KEY = 'logged-in-user';
const fetchLoggedInUserOptions = {
  queryKey: [FETCH_LOGGED_IN_USER_QUERY_KEY],
  queryFn: fetchLoggedInUser,
  refetchInterval: 0,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  suspense: true,
};

const authContext = createContext<AuthContext>({
  user: null,
});

export const useAuth = () => useContext(authContext);

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data } = useQuery(fetchLoggedInUserOptions);

  return (
    <authContext.Provider
      value={useMemo<AuthContext>(() => ({ user: data ?? null }), [data])}
    >
      {children}
    </authContext.Provider>
  );
};

export const refetchAuthContextData = async () =>
  queryClient.refetchQueries({
    queryKey: fetchLoggedInUserOptions.queryKey,
  });

export const prefetchAuthContextData = async () =>
  queryClient.prefetchQuery(fetchLoggedInUserOptions);
