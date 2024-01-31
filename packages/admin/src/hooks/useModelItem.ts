import { apiClient } from '@api';
import { useQuery } from '@tanstack/react-query';
import edjsHTML from 'editorjs-html';
import { useCallback, useMemo } from 'react';

import {
  ItemID,
  ResultItem,
  RichAxiosRequestConfig,
} from '@prom-cms/api-client';

// TODO: Support others
const editorJsBlockRulesParser = {
  image: function customParser(block) {
    return `<img />`;
  },
};

export const useModelItem = <T extends ResultItem>(
  modelName: string | undefined,
  itemId: ItemID | undefined,
  axiosConfig?: RichAxiosRequestConfig<T>,
  queryConfig?: Parameters<typeof useQuery<T>>['2']
) => {
  const shouldFetch = useMemo(() => itemId !== undefined, [itemId]);
  const fetcher = useCallback(
    () =>
      apiClient.entries
        .for(modelName!)
        .getOne<T>(itemId!, axiosConfig)
        .then(({ data }) => data.data),
    [modelName, itemId, axiosConfig]
  );
  const key = useMemo(() => [modelName, itemId], [modelName, itemId]);
  const response = useQuery<T>([key, axiosConfig], fetcher, {
    enabled: shouldFetch,
    ...queryConfig,
  });

  return useMemo(() => {
    const { data } = response;

    for (const [fieldKey, fieldValue] of Object.entries(data ?? {})) {
      if (typeof fieldValue !== 'object' || fieldValue === null) {
        continue;
      }

      // Support editorjs into tiptap
      if (
        'blocks' in fieldValue &&
        'time' in fieldValue &&
        'version' in fieldValue
      ) {
        const edjsParser = edjsHTML(editorJsBlockRulesParser);
        const html = edjsParser.parse(fieldValue);

        // @ts-ignore -- okay for this case
        data[fieldKey] = html;
      }
    }

    return { ...response, key };
  }, [key, response]);
};
