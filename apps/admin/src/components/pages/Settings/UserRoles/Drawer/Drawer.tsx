import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Button,
  Drawer as MantineDrawer,
  DrawerProps as MantineDrawerProps,
  SimpleGrid,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { ItemID } from '@prom-cms/shared';
import { useTranslation } from 'react-i18next';
import { useRequestWithNotifications } from '@hooks/useRequestWithNotifications';
import { UserRolesService } from '@services';
import { useGlobalContext } from '@contexts/GlobalContext';
import { Fragment } from 'react';
import { ModelPermissionToggles } from './ModelPermissionToggles';
import { useEffect } from 'react';
import { useModelItem } from '@hooks/useModelItem';
import { useMemo } from 'react';
import { CUSTOM_MODELS } from '@constants';

export const Drawer: FC<
  Pick<MantineDrawerProps, 'opened' | 'onClose'> & { optionToEdit?: ItemID }
> = ({ opened, onClose, optionToEdit }) => {
  const formMethods = useForm();
  const { t } = useTranslation();
  const { data } = useModelItem('userroles', optionToEdit);
  const reqWithNotification = useRequestWithNotifications();
  const { models } = useGlobalContext();
  const { handleSubmit, formState, register, reset } = formMethods;

  useEffect(() => {
    if (optionToEdit) {
      if (data) {
        reset(data);
      }
    } else {
      reset({});
    }
  }, [data, reset, optionToEdit, opened]);

  const onSubmit = async (values) => {
    try {
      reqWithNotification(
        {
          title: t(optionToEdit ? 'Updating user role' : 'Creating user role'),
          message: t('Please wait...'),
          successMessage: t(
            optionToEdit
              ? 'User role successfully updated'
              : 'User role has been created'
          ),
        },
        async () => {
          if (optionToEdit) {
            const { id, ...newOptionDataset } = values;
            await UserRolesService.update(optionToEdit, newOptionDataset);
          } else {
            await UserRolesService.create(values);
          }
          onClose();
        }
      );
    } catch (e) {}
  };

  const filteredModelEntries = useMemo(() => {
    if (models) {
      return Object.entries(models).filter(
        // Remove all custom models because they cannot be assigned to auth directly
        // We leave out settings because they can be assigned auth
        ([modelKey]) =>
          !CUSTOM_MODELS.filter((val) => val === 'settings').includes(modelKey)
      );
    }
  }, [models]);

  return (
    <FormProvider {...formMethods}>
      <MantineDrawer
        opened={opened}
        onClose={onClose}
        position="right"
        padding={32}
        size={500}
        className=" overflow-auto"
        title={
          <Title order={4}>
            {!!optionToEdit ? 'Update user role' : 'Create user role'}
          </Title>
        }
      >
        <form className="h-full" onSubmit={handleSubmit(onSubmit)}>
          <SimpleGrid cols={1} spacing="md">
            <TextInput label="Name" {...register('label')} />
            <Textarea
              autosize
              label={t('Description')}
              minRows={4}
              {...register('description')}
            />
            <Title mt="lg" order={4}>
              Permissions by models
            </Title>
            <SimpleGrid cols={1} className="gap-10">
              {filteredModelEntries &&
                filteredModelEntries.map(([modelName, modelValue]) => (
                  <Fragment key={modelName}>
                    <ModelPermissionToggles
                      modelInfo={modelValue}
                      modelName={modelName}
                    />
                  </Fragment>
                ))}
            </SimpleGrid>
          </SimpleGrid>
          <div className="sticky right-0 -bottom-8 rounded-lg bg-white pt-5 pb-4">
            <Button
              className="mr-auto block"
              type="submit"
              loading={formState.isSubmitting}
              loaderPosition="right"
            >
              {t(optionToEdit ? 'Save' : 'Create')}
            </Button>
          </div>
        </form>
      </MantineDrawer>
    </FormProvider>
  );
};
