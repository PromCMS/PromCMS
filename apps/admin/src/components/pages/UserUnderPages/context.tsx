import { useModelInfo } from '@hooks/useModelInfo';
import { useUser } from '@hooks/useUser';
import { ApiResultModel, User } from '@prom-cms/shared';
import { UserService } from '@services';
import { FC, createContext, useContext, PropsWithChildren } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { KeyedMutator } from 'swr';

type View = 'create' | 'update';

export interface IContext {
  view: View;
  isLoading: boolean;
  exitView: () => void;
  model?: ApiResultModel;
  user?: User;
  mutateUser: KeyedMutator<User>;
}

export const Context = createContext<IContext>({
  view: 'create',
  isLoading: true,
  exitView: () => {},
  mutateUser: async () => undefined,
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
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateOnReconnect: false,
    refreshWhenHidden: false,
  });
  const exitView = () => navigate(UserService.getListUrl());

  return (
    <Context.Provider
      value={{
        view,
        ...(currentUser.data ? { user: currentUser.data } : {}),
        mutateUser: currentUser.mutate,
        isLoading: currentUser.isLoading || currentUser.isError,
        exitView,
        model,
      }}
    >
      {children}
    </Context.Provider>
  );
};
