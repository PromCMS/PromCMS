import { apiClient } from '@api';
import ImageSelect from '@components/form/ImageSelect';
import { MESSAGES } from '@constants';
import { refetchAuthContextData, useAuth } from '@contexts/AuthContext';
import { PageLayout } from '@layouts/PageLayout';
import { ActionIcon, Button, Divider, TextInput, Tooltip } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { Link, createLazyFileRoute } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import { getInitials, getObjectDiff } from '@utils';
import clsx from 'clsx';
import { FC, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Lock } from 'tabler-icons-react';

import { User } from '@prom-cms/api-client';

import { LanguageSelect } from './-components';

export const Route = createLazyFileRoute('/_authorized/settings/profile/')({
  component: Page,
});

const AvatarSelect: FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <Controller
      name="avatar"
      render={({ field: { onChange, onBlur, value } }) => {
        return (
          <ImageSelect
            label={t(MESSAGES.AVATAR)}
            selected={value}
            multiple={false}
            onChange={(nextValue) => nextValue && onChange(nextValue)}
            onBlur={onBlur}
            wrapperClassName={clsx('md:w-3/6 w-full text-left')}
            classNames={{
              wrapper: 'flex-col items-start gap-3',
              imageWrapper:
                'relative w-full aspect-square rounded-prom overflow-hidden',
            }}
            imageProps={{
              width: 400,
            }}
            placeholderElement={
              <div className="m-auto text-4xl">
                {getInitials(user?.name || '-- --')}
              </div>
            }
            imageWrapperProps={{ disableStyles: true }}
          />
        );
      }}
    />
  );
};

function Page() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const formMethods = useForm({
    defaultValues: user ?? undefined,
  });
  const { register, handleSubmit, watch } = formMethods;

  const values = watch();

  const canSubmit = useMemo(() => {
    return !!Object.keys(getObjectDiff(user, values)).length;
  }, [user, values]);

  const onSubmit = async (values) => {
    const id = 'update-profile-settings-notification';

    showNotification({
      id,
      loading: true,
      title: t(MESSAGES.PLEASE_WAIT),
      message: t(MESSAGES.ITEM_UPDATE_WORKING),
      autoClose: false,
      disallowClose: true,
    });

    const diffedUser = getObjectDiff(user, values) as User;

    try {
      await apiClient.profile.update(diffedUser);
      await refetchAuthContextData();

      updateNotification({
        id,
        message: t(MESSAGES.ITEM_UPDATE_DONE),
        autoClose: 2000,
      });
    } catch (e) {
      updateNotification({
        id,
        color: 'red',
        message: t(MESSAGES.ERROR_BASIC),
        autoClose: 2000,
      });
    }
  };

  return (
    <PageLayout>
      <PageLayout.Header title={t(MESSAGES.PROFILE_PAGE_TITLE)} />
      <PageLayout.Content>
        <FormProvider {...formMethods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 w-full gap-8 pb-5 flex flex-col items-baseline md:flex-row h-full"
            autoComplete="off"
          >
            <AvatarSelect />
            <div className="w-full">
              <div className="flex gap-4 flex-col w-full">
                <TextInput
                  label={t(MESSAGES.FULL_NAME)}
                  className="w-full"
                  {...register('name')}
                />
                <TextInput
                  disabled
                  label="Email"
                  className="w-full"
                  rightSection={
                    <Tooltip label={t(MESSAGES.CHANGE_PASSWORD)}>
                      <ActionIcon
                        component={Link}
                        to={'/settings/profile/password/change'}
                        className="w-5 h-5"
                      >
                        <Lock size={17} />
                      </ActionIcon>
                    </Tooltip>
                  }
                  {...register('email')}
                />
              </div>

              <Divider
                label={t(MESSAGES.ADMIN_PANEL)}
                labelPosition="left"
                mt="xl"
                mb="sm"
              />
              <LanguageSelect />

              <Button
                className="mt-5 max-w-[150px]"
                size="md"
                color="green"
                type="submit"
                disabled={!canSubmit}
                loading={formMethods.formState.isSubmitting}
              >
                {t(MESSAGES.SAVE)}
              </Button>
            </div>
          </form>
        </FormProvider>
      </PageLayout.Content>
      <Outlet />
    </PageLayout>
  );
}
