import useCurrentModel from '@hooks/useCurrentModel';
import useCurrentModelItem from '@hooks/useCurrentModelItem';
import {
  createContext,
  FC,
  useContext,
  useMemo,
  useEffect,
  useRef,
  useState,
} from 'react';
import { EntryTypeUrlActionType } from '@custom-types';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getModelItemSchema } from '@schemas';
import { useRequestWithNotifications } from '@hooks/useRequestWithNotifications';
import { getObjectDiff } from '@utils';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import type EditorJS from '@editorjs/editorjs';
import { ReactNode } from 'react';
import { ReactElement } from 'react';
import { MutableRefObject } from 'react';
import { RefObject } from 'react';
import { useCallback } from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import { useSettings } from '@hooks/useSettings';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ResultItem } from '@prom-cms/api-client';
import { apiClient } from '@api';
import { pageUrls } from '@constants';

export interface IEntryUnderpageContext {
  currentView: EntryTypeUrlActionType;
  exitView: () => void;
  itemIsError: boolean;
  itemIsLoading: boolean;
  itemData?: ResultItem | undefined;
  itemIsMissing: boolean;
  mutateItem: (values: ResultItem) => ResultItem | undefined;
  asideOpen: boolean;
  setAsideOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: (values: any) => Promise<void>;
  language?: string;
  setLanguage: (nextLanguage: string | undefined) => void;
}

export const EntryUnderpageContext = createContext<IEntryUnderpageContext>({
  exitView: () => {},
  currentView: 'update',
  itemIsMissing: false,
  itemIsLoading: true,
  itemIsError: false,
  mutateItem: () => undefined,
  onSubmit: async () => {},
  setAsideOpen: () => {},
  asideOpen: false,
  setLanguage: () => {},
});

export const useEntryUnderpageContext = () => useContext(EntryUnderpageContext);

export const EntryUnderpageContextProvider: FC<{
  viewType: EntryTypeUrlActionType;
  children:
    | ReactElement
    | ((props: {
        formContentRefs: MutableRefObject<{
          editorRef: RefObject<EditorJS>;
        }>;
      }) => ReactNode);
}> = ({ children, viewType }) => {
  const settings = useSettings();
  const [language, setLanguage] = useState<string | undefined>(
    settings?.i18n?.default
  );
  const [asideOpen, setAsideOpen] = useLocalStorage({
    key: 'aside-toggled',
    defaultValue: true,
    deserialize: (value) => value === 'true',
  });
  const navigate = useNavigate();
  const editorRef = useRef<EditorJS>(null);
  // We make copy out of ref that came from useOnSubmit hook and make an object that contains refs
  const formContentRefs = useRef({ editorRef });
  const currentModel = useCurrentModel();
  const { t } = useTranslation();
  const {
    data: itemData,
    isError: itemIsError,
    isLoading: itemIsLoading,
    key: modelItemQueryKey,
  } = useCurrentModelItem(language);
  const schema = useMemo(
    () =>
      currentModel && getModelItemSchema(currentModel, viewType === 'update'),
    [currentModel, viewType]
  );
  const formMethods = useForm({
    defaultValues: itemData?.data || {},
    reValidateMode: 'onChange',
    mode: 'onTouched',
    resolver: schema && yupResolver(schema),
  });
  const queryClient = useQueryClient();
  const { setError } = formMethods;
  const reqNotification = useRequestWithNotifications();
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
    if (itemData) {
      formMethods.reset({
        ...itemData,
        ...(itemData.content
          ? { content: JSON.stringify(itemData.content) }
          : {}),
      });
    }
  }, [itemData, formMethods]);

  const onSubmit = useCallback(
    async (values) => {
      const modelName = (currentModel as NonNullable<typeof currentModel>).name;

      if (editorRef.current) {
        await editorRef.current?.isReady;

        values.content = JSON.stringify(await editorRef.current.save());
      }

      try {
        await reqNotification(
          {
            title: viewType === 'update' ? 'Updating' : 'Creating',
            message: t(
              viewType === 'update'
                ? 'Updating your entry, please wait...'
                : 'Creating new entry, please wait...'
            ),
            successMessage:
              viewType === 'create'
                ? t('Your entry is created!')
                : t('Your entry is updated!'),
          },
          async () => {
            if (viewType === 'update') {
              const finalValues = getObjectDiff(itemData, values) as ResultItem;
              const itemId = (itemData as NonNullable<typeof itemData>).id;

              const {
                data: { data },
              } = await apiClient.entries.update(
                modelName,
                itemId,
                finalValues,
                {
                  language,
                }
              );

              mutateItemInCache(data);
            } else if (viewType === 'create') {
              const result = await apiClient.entries.create(modelName, values);

              if (!result?.data) {
                throw new Error('No data has been received');
              }

              navigate(pageUrls.entryTypes(currentModel?.name as string).list);
            }
          }
        );
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.data?.code === 900409) {
          const fieldNames = e.response.data.data;
          if (Array.isArray(fieldNames) && fieldNames.length) {
            for (const fieldName of fieldNames) {
              const fieldInfo = currentModel?.columns?.[fieldName];
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
    },
    [
      currentModel,
      itemData,
      mutateItemInCache,
      navigate,
      reqNotification,
      setError,
      t,
      viewType,
      language,
    ]
  );

  const value = useMemo(
    () => ({
      currentView: viewType,
      exitView: () => {
        navigate(pageUrls.entryTypes(currentModel?.name as string).list);
      },
      itemData: updatedItemData as ResultItem,
      itemIsError,
      itemIsLoading: viewType === 'update' ? itemIsLoading : false,
      itemIsMissing: !updatedItemData,
      mutateItem: mutateItemInCache,
      asideOpen,
      setAsideOpen,
      onSubmit: formMethods.handleSubmit(onSubmit),
      language,
      setLanguage,
    }),
    [
      asideOpen,
      currentModel?.name,
      formMethods,
      itemIsError,
      itemIsLoading,
      mutateItemInCache,
      onSubmit,
      navigate,
      setAsideOpen,
      updatedItemData,
      viewType,
      language,
    ]
  );

  return (
    <FormProvider {...formMethods}>
      <EntryUnderpageContext.Provider value={value}>
        {typeof children === 'function'
          ? children({ formContentRefs })
          : children}
      </EntryUnderpageContext.Provider>
    </FormProvider>
  );
};