import { useGlobalContext } from '@contexts/GlobalContext';

export const useSettings = () => {
  const { settings } = useGlobalContext();

  return settings;
};
