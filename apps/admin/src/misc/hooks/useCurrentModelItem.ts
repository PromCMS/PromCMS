import { useParams } from 'react-router-dom';
import { useModelItem } from '.';
import useCurrentModel from './useCurrentModel';

const useModelItemConfig = {
  refreshInterval: 0,
  revalidateOnFocus: false,
  revalidateIfStale: false,
  revalidateOnMount: true,
  revalidateOnReconnect: false,
};

const useCurrentModelItem = (language?: string) => {
  const modelInfo = useCurrentModel();
  const { entryId } = useParams();
  const itemInfo = useModelItem(
    modelInfo?.name,
    (entryId as string) || undefined,
    useModelItemConfig,
    language
  );

  return itemInfo;
};

export default useCurrentModelItem;
