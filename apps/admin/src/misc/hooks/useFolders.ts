import { apiClient } from '@api';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from "react";

const fetcher = (path: string) => () => {
  return apiClient.folders.getMany(path).then((data) => data.data.data);
};

export const useFolders = (path: string) => {
  const key = useMemo(() => ['folders', path], [path])
  const response = useQuery(key, fetcher(path), {
    enabled: !!path,
  })

  return useMemo(() => ({...response, key}), [response, key])
};
