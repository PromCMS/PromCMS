import { apiClient } from '@api';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

export const useGeneralTranslations = (
  language: string,
  config?: Parameters<typeof useQuery<Record<string, string>>>['2']
) => {
  const fetcher = useCallback(
    () =>
      apiClient.generalTranslations
        .getManyForLanguage(language)
        .then(({ data }) => data.data),
    [language]
  );
  const key = useMemo(() => ['generalTranslations', language], [language]);
  const response = useQuery<Record<string, string>>(key, fetcher, {
    enabled: !!language,
    ...config,
  });

  return useMemo(() => ({ ...response, key }), [response, key]);
};
