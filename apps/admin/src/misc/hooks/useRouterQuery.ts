import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useRouterQuery = (name: string) => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search).get(name), [search, name]);
};
