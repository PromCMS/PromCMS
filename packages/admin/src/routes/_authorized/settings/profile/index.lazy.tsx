import { apiClient } from '@api';
import { AvatarSelect } from '@components/AvatarSelect';
import { MESSAGES } from '@constants';
import { refetchAuthContextData, useAuth } from '@contexts/AuthContext';
import { PageLayout } from '@layouts/PageLayout';
import { ActionIcon, Button, Divider, TextInput, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Link, createLazyFileRoute } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import { getObjectDiff } from '@utils';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Lock } from 'tabler-icons-react';

import { User } from '@prom-cms/api-client';

import { LanguageSelect } from './-components';

export const Route = createLazyFileRoute('/_authorized/settings/profile/')({
  component: Page,
});

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
    const id = notifications.show({
      loading: true,
      title: t(MESSAGES.PLEASE_WAIT),
      message: t(MESSAGES.ITEM_UPDATE_WORKING),
      autoClose: false,
    });

    const diffedUser = getObjectDiff(user, values) as User;

    try {
      await apiClient.profile.update(diffedUser);
      await refetchAuthContextData();

      notifications.update({
        id,
        message: t(MESSAGES.ITEM_UPDATE_DONE),
        autoClose: 2000,
        loading: false,
      });
    } catch (e) {
      notifications.update({
        id,
        color: 'red',
        message: t(MESSAGES.ERROR_BASIC),
        autoClose: 2000,
        loading: false,
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
            <AvatarSelect user={user} />
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
