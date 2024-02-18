import { apiClient } from '@api';
import { BASE_PROM_ENTITY_TABLE_NAMES } from '@constants';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { RichAxiosRequestConfig, UserRole } from '@prom-cms/api-client';

export const useUserRole = (
  roleId: string | undefined,
  axiosConfig?: RichAxiosRequestConfig<UserRole>,
  queryConfig?: Parameters<typeof useQuery<UserRole>>['2']
) => {
  const fetcher = useCallback(
    () =>
      apiClient.userRoles
        .getOne<UserRole>(roleId!, axiosConfig)
        .then(({ data }) => data.data),
    [roleId, axiosConfig]
  );
  return useQuery<UserRole>(
    [BASE_PROM_ENTITY_TABLE_NAMES.USER_ROLES, axiosConfig],
    fetcher,
    {
      enabled: !!roleId,
      ...queryConfig,
    }
  );
};
