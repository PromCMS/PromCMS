import { useSettings } from '@hooks/useSettings';
import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FormProvider, useForm, UseFormProps } from 'react-hook-form';
import { useCurrentSingletonData } from './useCurrentSingletonData';
import { ResultItem, EntityDuplicateErrorCode } from '@prom-cms/api-client';
import useCurrentSingleton from '@hooks/useCurrentSingleton';
import { getObjectDiff, isApiResponse, toastedPromise } from '@utils';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@api';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useBlockEditorRefs } from '@contexts/BlockEditorContext';
import { getModelItemSchema } from '@schemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { constructDefaultFormValues } from 'utils/constructDefaultFormValues';
import { logger } from '@logger';

export type SingletonPageContext = {
  setLanguage: Dispatch<SetStateAction<SingletonPageContext['language']>>;
  language?: string;
  data?: ResultItem;
  isLoading: boolean;
  clear: () => Promise<void>;
};
export const singletonPageContext = createContext<SingletonPageContext>({
  setLanguage: () => {},
  isLoading: true,
  async clear() {},
});
export const useSingletonPageContext = () => useContext(singletonPageContext);

export const SingletonPageContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const blockEditorRefs = useBlockEditorRefs();
  const settings = useSettings();
  const singleton = useCurrentSingleton(true);

  const resolver = useMemo<
    UseFormProps<Record<string, any>>['resolver']
  >(() => {
    if (!singleton) {
      return undefined;
    }
    const schema = getModelItemSchema(singleton, true);

    return async (data, context, options) => {
      const result = await yupResolver(schema)(data, context, options);
      logger.warning('Validating form:');
      logger.warning({ data, result });

      return result;
    };
  }, [singleton]);

  const formMethods = useForm<Record<string, any>>({
    defaultValues: constructDefaultFormValues(singleton, singleton ?? {}),
    reValidateMode: 'onChange',
    mode: 'onTouched',
    resolver,
  });
  const { t } = useTranslation();
  const [language, setLanguage] = useState(settings?.i18n?.default);
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    key: queryKey,
  } = useCurrentSingletonData(
    { language },
    {
      refetchInterval: 0,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  const { handleSubmit, setError } = formMethods;

  const mutateItemInCache = useCallback(
    (values: ResultItem) => queryClient.setQueryData(queryKey, values),
    [queryKey]
  );

  useEffect(() => {
    if (data) {
      formMethods.reset({
        ...Object.fromEntries(
          Object.entries(data).filter(([_, data]) => data !== null)
        ),
        ...(data.content ? { content: JSON.stringify(data.content) } : {}),
      });

      if (blockEditorRefs.refs.current) {
        for (const [fieldName, editorRef] of Object.entries(
          blockEditorRefs.refs.current
        )) {
          if (data[fieldName]) {
            editorRef?.blocks?.render(data[fieldName]);
          }
        }
      }
    }
  }, [data, formMethods]);

  const onSubmit = handleSubmit(async (values) => {
    const singletonName = singleton.key;

    if (blockEditorRefs.refs.current) {
      for (const [key, editorRef] of Object.entries(
        blockEditorRefs.refs.current
      )) {
        await editorRef?.isReady;

        if (editorRef && 'save' in editorRef) {
          values[key] = JSON.stringify(await editorRef.save());
        }
      }
    }

    try {
      await toastedPromise(
        {
          title: 'Updating',
          message: t('Updating, please wait...'),
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
      if (
        axios.isAxiosError(e) &&
        isApiResponse(e.response) &&
        e.response?.data?.code === EntityDuplicateErrorCode
      ) {
        // TODO: add types
        const fieldNames = e.response.data.data;
        if (Array.isArray(fieldNames) && fieldNames.length) {
          for (const fieldName of fieldNames) {
            const fieldInfo = singleton?.columns?.get(fieldName);
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

          if (blockEditorRefs.refs.current) {
            for (const editorRef of Object.values(
              blockEditorRefs.refs.current
            )) {
              editorRef?.blocks.clear?.();
            }
          }

          formMethods.reset(result);
          mutateItemInCache(result);
        }
      ),
    [mutateItemInCache, singleton, t, blockEditorRefs, formMethods.reset]
  );

  const contextValue = useMemo(
    () => ({ language, setLanguage, data, isLoading, clear }),
    [language, setLanguage, clear]
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
