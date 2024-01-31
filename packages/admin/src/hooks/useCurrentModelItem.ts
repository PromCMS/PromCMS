import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useModelItem } from './useModelItem';
import useCurrentModel from './useCurrentModel';

const queryConfig = {
  suspense: true,
  refetchInterval: 0,
  refetchOnWindowFocus: false,
  refetchOnMount: true,
  refetchIntervalInBackground: false,
  refetchOnReconnect: false,
};

const useCurrentModelItem = (language?: string) => {
  const modelInfo = useCurrentModel();
  const { entryId } = useParams();
  const axiosConfig = useMemo(
    () => ({
      language,
    }),
    [language]
  );

  return useModelItem(
    modelInfo?.name,
    (entryId as string) || undefined,
    axiosConfig,
    useMemo(
      () => ({
        ...queryConfig,
        select(originalData) {
          // TODO: this is uqly and backend generally should return already transformed json
          for (const [fieldKey, { type }] of [
            ...(modelInfo?.columns.entries() ?? []),
          ]) {
            const value = originalData[fieldKey];
            if (value === null) {
              delete originalData[fieldKey];
              continue;
            }

            if (type === 'json' && value) {
              (originalData as any)[fieldKey] =
                typeof value === 'string' ? JSON.parse(value) : value;
            }
          }

          return originalData as typeof originalData;
        },
      }),
      [modelInfo?.columns]
    )
  );
};

export default useCurrentModelItem;
