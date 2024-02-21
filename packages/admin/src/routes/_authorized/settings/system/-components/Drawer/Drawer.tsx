import { apiClient } from '@api';
import AsideItemWrap from '@components/editorialPage/AsideItemWrap';
import { LanguageSelect } from '@components/form/LanguageSelect';
import { BASE_PROM_ENTITY_TABLE_NAMES, MESSAGES } from '@constants';
import { useSettings } from '@contexts/SettingsContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Select, SimpleGrid, TextInput } from '@mantine/core';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useModelItem } from 'hooks/useModelItem';
import { useRequestWithNotifications } from 'hooks/useRequestWithNotifications';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import slugify from 'slugify';
import { z } from 'zod';

import { ItemID } from '@prom-cms/api-client';

import { Image } from './contentTypes/Image';
import { List } from './contentTypes/List';
import { Textarea } from './contentTypes/Textarea';

const stringSchema = z
  .string({
    required_error: MESSAGES.FIELD_REQUIRED,
  })
  .min(1, MESSAGES.FIELD_REQUIRED);

const schema = z.object({
  id: z.any().optional(),
  name: stringSchema,
  slug: stringSchema,
  content: z.object({
    type: stringSchema,
    data: z.any({ required_error: MESSAGES.FIELD_REQUIRED }),
  }),
});

type FormValue = z.infer<typeof schema>;

export const Drawer: FC<{
  optionToEdit?: ItemID;
  onOptionUpdateOrCreate: () => Promise<void>;
}> = ({ optionToEdit, onOptionUpdateOrCreate }) => {
  const settings = useSettings();
  const isCreate = optionToEdit === undefined;
  const [language, setLanguage] = useState<string | undefined>(
    settings.application?.i18n?.default
  );
  const currentUser = useCurrentUser();
  const { data } = useModelItem(
    BASE_PROM_ENTITY_TABLE_NAMES.SETTINGS,
    optionToEdit,
    {
      language,
    }
  );
  const { t } = useTranslation();
  const reqNotification = useRequestWithNotifications();
  const formMethods = useForm<FormValue>({
    defaultValues: {} as any,
    resolver: zodResolver(schema),
  });
  const { register, reset, control, handleSubmit, setValue, formState } =
    formMethods;

  const currentUserCanCreate = currentUser?.can({
    action: 'create',
    targetEntityTableName: BASE_PROM_ENTITY_TABLE_NAMES.SETTINGS,
  });

  useEffect(() => {
    if (optionToEdit) {
      if (data) {
        reset(data);
      }
    } else {
      reset({});
    }
  }, [data, reset, optionToEdit]);

  const contentType = useWatch({
    name: 'content.type',
    control,
  });

  const slug = useWatch({
    name: 'slug',
    control,
  });

  const onSubmit = async (values) => {
    try {
      reqNotification(
        {
          title: t(
            !isCreate
              ? MESSAGES.SELECT_OPTION_UPDATE_WORKING
              : MESSAGES.SELECT_OPTION_ADD_NEW_WORKING
          ),
          message: t(MESSAGES.PLEASE_WAIT),
          successMessage: t(
            !isCreate
              ? MESSAGES.SELECT_OPTION_UPDATE_DONE
              : MESSAGES.SELECT_OPTION_ADD_NEW_DONE
          ),
        },
        async () => {
          if (!isCreate) {
            const { id, ...newOptionDataset } = values;
            await apiClient.settings.update(optionToEdit, newOptionDataset, {
              language,
            });
          } else {
            await apiClient.settings.create(values);
          }

          await onOptionUpdateOrCreate();
        }
      );
    } catch (e) {}
  };

  return (
    <FormProvider {...formMethods}>
      <AsideItemWrap
        title={!isCreate ? 'Update an option' : 'Create an option'}
        className=" overflow-auto"
      >
        <form className="h-full px-3" onSubmit={handleSubmit(onSubmit)}>
          <SimpleGrid cols={1} spacing="sm">
            {currentUserCanCreate && (
              <>
                <Controller
                  name="content.type"
                  control={control}
                  render={({ field: { name, onChange, onBlur, value } }) => (
                    <Select
                      placeholder="Select type"
                      name={name}
                      onChange={(value) => {
                        onChange(value);
                        setValue('content.data', undefined);
                      }}
                      onBlur={onBlur}
                      value={value}
                      label="Select datatype"
                      data={[
                        { value: 'list', label: 'List' },
                        { value: 'textArea', label: 'Long text' },
                        { value: 'image', label: 'Image' },
                      ]}
                      error={
                        typeof formState.errors.content?.type === 'object'
                          ? formState.errors.content?.type.message
                          : undefined
                      }
                    />
                  )}
                />

                {(settings.application?.i18n.languages.length ?? 0) > 1 && (
                  <LanguageSelect
                    value={language}
                    onChange={(value) => value && setLanguage(value)}
                    className="w-full"
                    comboboxProps={{ shadow: 'xl' }}
                    pt="md"
                    disabled={!optionToEdit}
                  />
                )}
              </>
            )}
            <TextInput
              label="Label"
              {...register('name', {
                onChange(event: ChangeEvent<HTMLInputElement>) {
                  if (isCreate) {
                    setValue(
                      'slug',
                      slugify(event.target.value, {
                        replacement: '_',
                        lower: true,
                        trim: true,
                      })
                    );
                  }
                },
              })}
              description={slug ? <>Slug: {slug}</> : undefined}
              inputWrapperOrder={['label', 'input', 'description', 'error']}
              error={formState.errors.name?.message}
            />
            <div>
              {contentType === 'list' && <List />}
              {contentType === 'textArea' && <Textarea />}
              {contentType === 'image' && <Image />}
              {/* {typeof formState.errors.content?.data === 'object' ? (
                <small className="color-red-500">
                  {formState.errors.content?.data?.message}
                </small>
              ) : null} */}
            </div>
          </SimpleGrid>
          <div className="right-0 mt-5 rounded-lg pb-4">
            <Button
              className="mr-auto block"
              type="submit"
              color="green"
              loading={formState.isSubmitting}
            >
              {t(optionToEdit ? 'Save' : 'Create')}
            </Button>
          </div>
        </form>
      </AsideItemWrap>
    </FormProvider>
  );
};
