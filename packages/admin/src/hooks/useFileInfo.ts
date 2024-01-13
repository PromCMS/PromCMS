import { apiClient } from '@api';
import { useQuery } from '@tanstack/react-query';

import { FileItem, ItemID } from '@prom-cms/api-client';

export const useFileInfo = (
  fileId?: ItemID,
  queryConfig?: Parameters<typeof useQuery<FileItem>>['2']
) => {
  const shouldFetch = fileId !== undefined && fileId !== 'undefined';

  return useQuery<FileItem>(
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
