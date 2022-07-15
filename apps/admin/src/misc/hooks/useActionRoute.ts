import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useRouterQuery } from '.';

export function useActionRoute<T extends string>(): {
  type?: T;
  payload?: string;
  update: (nextActionName: string, payload?: string | undefined) => void;
  remove: () => void;
} {
  const { push, pathname, query } = useRouter();
  const actions = useRouterQuery('action');

  const update = useCallback(
    (nextActionName: string, payload: string = '') => {
      push({
        pathname,
        query: {
          ...query,
          action: `${nextActionName}${payload ? '/' : ''}${payload}`,
        },
      });
    },
    [pathname, push, query]
  );

  const remove = useCallback(() => {
    const newQuery = { ...query };

    delete newQuery['action'];

    push({
      pathname,
      query: newQuery,
    });
  }, [pathname, push, query]);

  if (!actions || Array.isArray(actions))
    return { type: undefined, payload: undefined, update, remove };
  const [type, payload] = actions.split('/') as [T, string | undefined];

  return { type, payload, update, remove };
}
