import { pageUrls } from '@constants';
import { useModelInfo } from '@hooks/useModelInfo';
import { useUser } from '@hooks/useUser';
import { useQueryClient } from '@tanstack/react-query';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ApiResultModel, User } from '@prom-cms/api-client';

type View = 'create' | 'update';

export interface IContext {
  view: View;
  isLoading: boolean;
  exitView: () => void;
  model?: ApiResultModel;
  user?: User;
  mutateUser: (nextData: User) => void;
}

export const Context = createContext<IContext>({
  view: 'create',
  isLoading: true,
  exitView: () => {},
  mutateUser: (async () => {}) as any,
});

export const useData = () => useContext(Context);

export const ContextProvider: FC<PropsWithChildren<{ view: View }>> = ({
  view,
  children,
}) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const model = useModelInfo('users') as ApiResultModel;
  const currentUser = useUser(userId as string, {
    enabled: false,
  });
  const client = useQueryClient();
  const exitView = () => navigate(pageUrls.users.list);
  const updateUserInCache = useCallback(
    (nextData: User) => {
      client.setQueryData<User>(currentUser.key, (prevData) => ({
        ...prevData,
        ...nextData,
      }));
    },
    [client, currentUser.key]
  );

  useEffect(() => {
    if (userId) {
      currentUser.refetch();
    }

    return () => currentUser.remove();
  }, [userId]);

  return (
    <Context.Provider
      value={{
        view,
        ...(currentUser.data ? { user: currentUser.data } : {}),
        mutateUser: updateUserInCache,
        isLoading: currentUser.isLoading || currentUser.isError,
        exitView,
        model,
      }}
    >
      {children}
    </Context.Provider>
  );
};
