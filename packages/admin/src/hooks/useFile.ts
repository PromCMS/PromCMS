import { apiClient } from '@api';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { ItemID } from '@prom-cms/api-client';

export const useFile = (fileId?: ItemID) => {
  const fetcher = useCallback(
    () =>
      fileId
        ? apiClient.library.files.getOne(fileId).then(({ data }) => data.data)
        : null,
    [fileId]
  );
  const key = useMemo(() => ['files', fileId], [fileId]);
  const response = useQuery(key, fetcher, {
    enabled: !!fileId,
  });

  return useMemo(() => ({ ...response, key }), [key, response]);
};
