import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useModelItem } from './useModelItem';
import useCurrentModel from './useCurrentModel';

const queryConfig = {
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
    queryConfig
  );
};

export default useCurrentModelItem;
