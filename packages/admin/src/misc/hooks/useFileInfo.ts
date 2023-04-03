import { apiClient } from '@api';
import { File, ItemID } from '@prom-cms/shared';
import { useQuery } from '@tanstack/react-query';

export const useFileInfo = (
  fileId?: ItemID,
  queryConfig?: Parameters<typeof useQuery<File>>['2']
) => {
  const shouldFetch = fileId !== undefined && fileId !== 'undefined';

  return useQuery<File>(
    ['files', fileId],
    ({ queryKey }) =>
      apiClient.files
        .getOne(queryKey[1] as ItemID)
        .then((val) => val.data.data),
    {
      enabled: shouldFetch,
      ...queryConfig,
    }
  );
};
