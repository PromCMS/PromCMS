import { useSettings } from '@hooks/useSettings';
import {
  createContext,
  Dispatch,
  FC,
  MutableRefObject,
  PropsWithChildren,
  RefObject,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type EditorJS from '@editorjs/editorjs';
import { FormProvider, useForm } from 'react-hook-form';
import { useCurrentSingletonData } from './useCurrentSingletonData';
import { ResultItem } from '@prom-cms/api-client';
import useCurrentSingleton from '@hooks/useCurrentSingleton';
import { getObjectDiff, toastedPromise } from '@utils';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@api';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export type SingletonPageContext = {
  setLanguage: Dispatch<SetStateAction<SingletonPageContext['language']>>;
  formContentRefs: MutableRefObject<{
    editorRef: RefObject<EditorJS>;
  }>;
  language?: string;
  data?: ResultItem;
  isLoading: boolean;
  clear: () => Promise<void>;
};
export const singletonPageContext = createContext<SingletonPageContext>({
  setLanguage: () => {},
  formContentRefs: { current: undefined as any },
  isLoading: true,
  async clear() {},
});
export const useSingletonPageContext = () => useContext(singletonPageContext);

export const SingletonPageContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const settings = useSettings();
  const formMethods = useForm();
  const singleton = useCurrentSingleton(true);
  const { t } = useTranslation();
  const editorRef = useRef<EditorJS>(null);
  const formContentRefs = useRef({ editorRef });
  const [language, setLanguage] = useState(settings?.i18n?.default);
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    key: queryKey,
  } = useCurrentSingletonData(undefined, {
    refetchInterval: 0,
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });

  const { handleSubmit, setError } = formMethods;

  const mutateItemInCache = useCallback(
    (values: ResultItem) => queryClient.setQueryData(queryKey, values),
    [queryKey]
  );

  useEffect(() => {
    if (data) {
      formMethods.reset({
        ...data,
        ...(data.content ? { content: JSON.stringify(data.content) } : {}),
      });
    }
  }, [data, formMethods]);

  const onSubmit = handleSubmit(async (values) => {
    const singletonName = singleton.key;

    if (editorRef.current) {
      await editorRef.current?.isReady;

      values.content = JSON.stringify(await editorRef.current.save());
    }

    try {
      await toastedPromise(
        {
          title: 'Updating',
          message: t('Updating your entry, please wait...'),
          successMessage: t('Your entry is updated!'),
        },
        async () => {
          const finalValues = getObjectDiff(data, values) as ResultItem;

          const {
            data: { data: updateResult },
          } = await apiClient.singletons.update(singletonName, finalValues, {
            language,
          });

          mutateItemInCache(updateResult);
        }
      );
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.data?.code === 900409) {
        const fieldNames = e.response.data.data;
        if (Array.isArray(fieldNames) && fieldNames.length) {
          for (const fieldName of fieldNames) {
            const fieldInfo = singleton?.columns?.[fieldName];
            let variableFieldName = fieldName;

            if (fieldName === 'slug' && fieldInfo?.type === 'slug') {
              variableFieldName = fieldInfo.of;
            }

            setError(variableFieldName, {
              message: t(
                'This field is unique and other entry has the same value'
              ),
            });
          }
        }
      }
    }
  });

  const clear = useCallback(
    async () =>
      toastedPromise(
        {
          message: t('Clearing singleton...'),
          title: t('Clearing'),
          errorMessage: t('Failed to clear'),
          successMessage: t('Clearing successful!'),
        },
        async () => {
          const {
            data: { data: result },
          } = await apiClient.singletons.clear(singleton?.key!);

          editorRef.current?.blocks.clear();

          mutateItemInCache(result);
        }
      ),
    [mutateItemInCache, singleton, t]
  );

  const contextValue = useMemo(
    () => ({ language, setLanguage, formContentRefs, data, isLoading, clear }),
    [language, setLanguage, formContentRefs, clear]
  );

  return (
    <FormProvider {...formMethods}>
      <singletonPageContext.Provider value={contextValue}>
        <form className="flex" onSubmit={onSubmit}>
          {children}
        </form>
      </singletonPageContext.Provider>
    </FormProvider>
  );
};
