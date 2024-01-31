import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRouterQuery } from '.';

export function useActionRoute<T extends string>(): {
  type?: T;
  payload?: string;
  update: (nextActionName: string, payload?: string | undefined) => void;
  remove: () => void;
} {
  const navigate = useNavigate();
  const { search } = useLocation();
  const actions = useRouterQuery('action');

  const update = useCallback(
    (nextActionName: string, payload: string = '') => {
      const searchParams = new URLSearchParams(search);

      searchParams.set(
        'action',
        `${nextActionName}${payload ? '/' : ''}${payload}`
      );

      navigate({
        search: new URLSearchParams(search).toString(),
      });
    },
    [search]
  );

  const remove = useCallback(() => {
    const searchParams = new URLSearchParams(search);

    searchParams.delete('action');

    navigate({
      search: new URLSearchParams(search).toString(),
    });
  }, [search]);

  if (!actions || Array.isArray(actions))
    return { type: undefined, payload: undefined, update, remove };
  const [type, payload] = actions.split('/') as [T, string | undefined];

  return { type, payload, update, remove };
}
