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
    {
      ...queryConfig,
      select(originalData) {
        const newData = {
          ...Object.fromEntries(
            Object.entries(originalData).filter(([_, data]) => data !== null)
          ),
        };

        // TODO: this is uqly and backend generally should return already transformed json
        for (const fieldKey of [...(modelInfo?.columns.entries() ?? [])]
          .filter(([, { type }]) => type === 'json')
          .map(([key]) => key)) {
          const value = newData[fieldKey];
          if (value) {
            newData[fieldKey] =
              typeof value === 'string' ? JSON.parse(value) : value;
          }
        }

        return newData as typeof originalData;
      },
    }
  );
};

export default useCurrentModelItem;
