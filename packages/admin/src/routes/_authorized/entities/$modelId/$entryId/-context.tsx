import { apiClient } from '@api';
import { MESSAGES, pageUrls } from '@constants';
import { useSettings } from '@contexts/SettingsContext';
import { EntryTypeUrlActionType } from '@custom-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { logger } from '@logger';
import { getModelItemSchema } from '@schemas';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { getObjectDiff, isApiResponse, toastedPromise } from '@utils';
import axios from 'axios';
import {
  FC,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ReactElement } from 'react';
import { useCallback } from 'react';
import { FormProvider, UseFormProps, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { constructDefaultFormValues } from 'utils/constructDefaultFormValues';

import { EntityDuplicateErrorCode, ResultItem } from '@prom-cms/api-client';

import useCurrentModel from '../-useCurrentModel';
import { useCurrentModelItem } from './-hooks';

export interface IEntryUnderpageContext {
  currentView: EntryTypeUrlActionType;
  exitView: () => void;
  itemIsError: boolean;
  itemIsLoading: boolean;
  itemData?: Omit<ResultItem, 'id'> | undefined;
  itemIsMissing: boolean;
  mutateItem: (values: ResultItem) => ResultItem | undefined;
  onSubmit: (values: any) => Promise<void>;
  language?: string;
  setLanguage: (nextLanguage: string | undefined) => void;
}

export const entryUnderpageContext = createContext<IEntryUnderpageContext>({
  exitView: () => {},
  currentView: 'update',
  itemIsMissing: false,
  itemIsLoading: true,
  itemIsError: false,
  mutateItem: () => undefined,
  onSubmit: async () => {},
  setLanguage: () => {},
});

export const useEntryUnderpageContext = () => useContext(entryUnderpageContext);

export const EntryUnderpageContextProvider: FC<{
  viewType: EntryTypeUrlActionType;
  children: ReactElement;
}> = ({ children, viewType }) => {
  const settings = useSettings();
  const [language, setLanguage] = useState<string | undefined>(
    settings.application?.i18n?.default
  );
  const navigate = useNavigate();
  const currentModel = useCurrentModel(true);
  const { t } = useTranslation();
  const {
    data: itemData,
    isError: itemIsError,
    isLoading: itemIsLoading,
    key: modelItemQueryKey,
    refetch,
  } = useCurrentModelItem(language);

  const resolver = useMemo<
    UseFormProps<Record<string, any>>['resolver']
  >(() => {
    if (!currentModel) {
      return undefined;
    }
    const schema = getModelItemSchema(currentModel, viewType === 'update');

    return async (data, context, options) => {
      const result = await zodResolver(schema)(data, context, options);
      logger.warning('Validating form:');
      logger.warning({ data, result });

      return result;
    };
  }, [currentModel, viewType]);

  const formMethods = useForm<Record<string, any>>({
    defaultValues: constructDefaultFormValues(currentModel, itemData ?? {}),
    reValidateMode: 'onChange',
    mode: 'onTouched',
    resolver,
  });
  const queryClient = useQueryClient();
  const { setError } = formMethods;
  const mutateItemInCache = useCallback(
    (values: ResultItem) => queryClient.setQueryData(modelItemQueryKey, values),
    [modelItemQueryKey]
  );

  // Unset id because of duplication
  // TODO we should handle this better via third viewType
  const updatedItemData = useMemo(() => {
    if (itemData && viewType === 'create') {
      const { id, ...restItemData } = itemData;
      return restItemData;
    }

    return itemData;
  }, [itemData, viewType]);

  useEffect(() => {
    if (viewType === 'update' && itemData) {
      formMethods.reset(
        constructDefaultFormValues(currentModel, itemData ?? {})
      );
    }
  }, [itemData, viewType, formMethods.reset, currentModel]);

  const onSubmit = useCallback(
    async (values) => {
      const modelName = (currentModel as NonNullable<typeof currentModel>).name;

      try {
        await toastedPromise(
          {
            title: t(
              viewType === 'update'
                ? MESSAGES.ITEM_UPDATE_WORKING
                : MESSAGES.ITEM_CREATE_WORKING
            ),
            message: t(MESSAGES.PLEASE_WAIT),
            successMessage:
              viewType === 'create'
                ? t(MESSAGES.ITEM_CREATE_DONE)
                : t(MESSAGES.ITEM_UPDATE_DONE),
          },
          async () => {
            if (viewType === 'update') {
              const finalValues = getObjectDiff(itemData, values) as ResultItem;
              const itemId = (itemData as NonNullable<typeof itemData>).id;

              await apiClient.entries
                .for(modelName)
                .update(itemId, finalValues, {
                  language,
                });

              await refetch();
            } else if (viewType === 'create') {
              const result = await apiClient.entries
                .for(modelName)
                .create(values);

              if (!result?.data) {
                throw new Error('No data has been received');
              }

              navigate({
                to: pageUrls.entryTypes(currentModel?.name as string).list,
              });
            }
          }
        );
      } catch (e) {
        if (
          axios.isAxiosError(e) &&
          isApiResponse(e.response) &&
          e.response.headers['content-description']?.includes(
            String(EntityDuplicateErrorCode)
          )
        ) {
          // TODO: add type
          const fieldNames = e.response.data.data;
          if (Array.isArray(fieldNames) && fieldNames.length) {
            for (const fieldName of fieldNames) {
              const fieldInfo = currentModel?.columns.find(
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
                message: t(MESSAGES.FIELD_UNIQUE),
              });
            }
          }
        }
      }
    },
    [
      currentModel,
      itemData,
      mutateItemInCache,
      navigate,
      setError,
      t,
      viewType,
      language,
      refetch,
    ]
  );

  const value = useMemo(
    () => ({
      currentView: viewType,
      exitView: () => {
        navigate({
          to: pageUrls.entryTypes(currentModel?.name as string).list,
        });
      },
      itemData: updatedItemData,
      itemIsError,
      itemIsLoading: viewType === 'update' ? itemIsLoading : false,
      itemIsMissing: !updatedItemData,
      mutateItem: mutateItemInCache,
      onSubmit: formMethods.handleSubmit(onSubmit),
      language,
      setLanguage,
    }),
    [
      currentModel?.name,
      formMethods,
      itemIsError,
      itemIsLoading,
      mutateItemInCache,
      onSubmit,
      navigate,
      updatedItemData,
      viewType,
      language,
    ]
  );

  return (
    <FormProvider {...formMethods}>
      <entryUnderpageContext.Provider value={value}>
        {children}
      </entryUnderpageContext.Provider>
    </FormProvider>
  );
};
