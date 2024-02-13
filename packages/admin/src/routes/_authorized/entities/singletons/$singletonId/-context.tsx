import { apiClient } from '@api';
import { useSettings } from '@contexts/SettingsContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { logger } from '@logger';
import { getModelItemSchema } from '@schemas';
import { getObjectDiff, isApiResponse, toastedPromise } from '@utils';
import axios from 'axios';
import useCurrentSingleton from 'hooks/useCurrentSingleton';
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FormProvider, UseFormProps, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { constructDefaultFormValues } from 'utils/constructDefaultFormValues';

import { EntityDuplicateErrorCode, ResultItem } from '@prom-cms/api-client';

import { useCurrentSingletonData } from './-useCurrentSingletonData';

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
      const result = await zodResolver(schema)(data, context, options);
      logger.warning('Validating form:');
      logger.warning({ data, result });

      return result;
    };
  }, [singleton]);

  const { t } = useTranslation();
  const [language, setLanguage] = useState(settings.application?.i18n?.default);
  const { data, isLoading, refetch } = useCurrentSingletonData(
    { language },
    {
      refetchInterval: 0,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const formMethods = useForm<Record<string, any>>({
    defaultValues: constructDefaultFormValues(singleton, data ?? {}),
    reValidateMode: 'onChange',
    mode: 'onTouched',
    resolver,
  });

  const { handleSubmit, setError } = formMethods;

  useEffect(() => {
    if (data) {
      formMethods.reset(data);
    }
  }, [data, formMethods.reset]);

  const onSubmit = handleSubmit(async (values) => {
    const singletonName = singleton.key;

    try {
      await toastedPromise(
        {
          title: 'Updating',
          message: t('Updating, please wait...'),
          successMessage: t('Your entry is updated!'),
        },
        async () => {
          const finalValues = getObjectDiff(data, values) as ResultItem;

          await apiClient.singletons.for(singletonName).update(finalValues, {
            language,
          });

          await refetch();
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
            const fieldInfo = singleton?.columns?.find(
              (column) => column.name === fieldName
            );

            if (!fieldInfo) {
              continue;
            }

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
          await apiClient.singletons.for(singleton?.key!).clear();

          await refetch();
        }
      ),
    [singleton, t, formMethods.reset]
  );

  const contextValue = useMemo(
    () => ({ language, setLanguage, data, isLoading, clear }),
    [language, setLanguage, clear]
  );

  return (
    <FormProvider {...formMethods}>
      <singletonPageContext.Provider value={contextValue}>
        <form onSubmit={onSubmit}>{children}</form>
      </singletonPageContext.Provider>
    </FormProvider>
  );
};
