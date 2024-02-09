import { BASE_PROM_ENTITY_TABLE_NAMES, pageUrls } from '@constants';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useModelInfo } from 'hooks/useModelInfo';
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from 'react';

import { ApiResultModel, User } from '@prom-cms/api-client';

type View = 'create' | 'update';

export interface IContext {
  view: View;
  exitView: () => void;
  model?: ApiResultModel;
}

export const Context = createContext<IContext>({
  view: 'create',
  exitView: () => {},
});

export const useData = () => useContext(Context);

export const ContextProvider: FC<PropsWithChildren<{ view: View }>> = ({
  view,
  children,
}) => {
  const navigate = useNavigate();
  const model = useModelInfo(
    BASE_PROM_ENTITY_TABLE_NAMES.USERS
  ) as ApiResultModel;
  const exitView = () => navigate({ to: pageUrls.users.list });
  // const updateUserInCache = useCallback(
  //   (nextData: User) => {
  //     client.setQueryData<User>(currentUser.key, (prevData) => ({
  //       ...prevData,
  //       ...nextData,
  //     }));
  //   },
  //   [client, currentUser.key]
  // );

  // useEffect(() => {
  //   if (userId) {
  //     currentUser.refetch();
  //   }

  //   return () => currentUser.remove();
  // }, [userId]);

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          view,
          exitView,
          model,
        }),
        [view, exitView, model]
      )}
    >
      {children}
    </Context.Provider>
  );
};
