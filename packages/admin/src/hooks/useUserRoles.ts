import { apiClient } from '@api';
import { BASE_PROM_ENTITY_TABLE_NAMES } from '@constants';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { RichAxiosRequestConfig, UserRole } from '@prom-cms/api-client';

export const useUserRoles = (
  axiosConfig?: RichAxiosRequestConfig<UserRole[]>,
  queryConfig?: Parameters<typeof useQuery<UserRole[]>>['2']
) => {
  const fetcher = useCallback(
    () => apiClient.userRoles.getMany(axiosConfig).then(({ data }) => data),
    [axiosConfig]
  );

  return useQuery<UserRole[]>(
    [BASE_PROM_ENTITY_TABLE_NAMES.USER_ROLES, axiosConfig],
    fetcher,
    queryConfig
  );
};
