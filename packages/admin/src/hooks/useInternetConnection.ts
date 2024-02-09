import { useEffect, useState } from 'react';

export const useInternetConnection = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // TODO
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [setIsOnline]);

  return {
    isOnline,
  };
};
