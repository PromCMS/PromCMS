import { PagedResponse, ResultItem } from "@prom-cms/api-client"
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@api";
import { useCallback, useMemo } from "react";

export const useModelItems = <T extends ResultItem>(
  modelName: string | undefined,
  axiosConfig?: Parameters<typeof apiClient.entries.getMany<T>>["1"],
  queryConfig?: Parameters<typeof useQuery<PagedResponse<T>>>["2"],
) => {
  const fetcher = useCallback(() => apiClient.entries.getMany<T>(modelName!, axiosConfig!).then(({ data }) => data), [modelName,axiosConfig]);
  const key = useMemo(() => [modelName, axiosConfig], [modelName, axiosConfig])
  const result = useQuery<PagedResponse<T>>(
    key, fetcher, queryConfig
  );

  return useMemo(() => ({...result, key}), [key, result])
};

