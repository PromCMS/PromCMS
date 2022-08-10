import useCurrentModel from '@hooks/useCurrentModel';
import useCurrentModelItem from '@hooks/useCurrentModelItem';
import { ApiResultItem } from '@prom-cms/shared';
import { EntryService } from '@services';
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
import { KeyedMutator } from 'swr';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getModelItemSchema } from '@schemas';
import { useRequestWithNotifications } from '@hooks/useRequestWithNotifications';
import { getObjectDiff } from '@utils';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import EditorJS from '@editorjs/editorjs';
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

export interface IEntryUnderpageContext {
  currentView: EntryTypeUrlActionType;
  exitView: () => void;
  itemIsError: boolean;
  itemIsLoading: boolean;
  itemData?: ApiResultItem | undefined;
  itemIsMissing: boolean;
  mutateItem: KeyedMutator<ApiResultItem>;
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
  mutateItem: async () => undefined,
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
    itemIsMissing,
    mutate,
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
  const { setError } = formMethods;
  const reqNotification = useRequestWithNotifications();

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
              const finalValues = getObjectDiff(
                itemData,
                values
              ) as ApiResultItem;
              const itemId = (itemData as NonNullable<typeof itemData>).id;

              await EntryService.update(
                {
                  id: itemId,
                  model: modelName,
                  language,
                },
                finalValues
              );

              await mutate(
                (prevData) => {
                  if (prevData?.id) {
                    return {
                      ...(prevData || {}),
                      ...finalValues,
                    };
                  } else {
                    return prevData;
                  }
                },
                { revalidate: true }
              );
            } else if (viewType === 'create') {
              const result = await EntryService.create(
                {
                  model: modelName,
                },
                values
              );

              if (!result?.data) {
                throw new Error('No data has been received');
              }

              navigate(EntryService.getListUrl(currentModel?.name as string));
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
      mutate,
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
        navigate(EntryService.getListUrl(currentModel?.name as string));
      },
      itemData: updatedItemData as ApiResultItem,
      itemIsError,
      itemIsLoading: viewType === 'update' ? itemIsLoading : false,
      itemIsMissing,
      mutateItem: mutate,
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
      itemIsMissing,
      mutate,
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
