import { apiClient } from '@api';
import ImageSelect from '@components/form/ImageSelect';
import { MESSAGES } from '@constants';
import { refetchAuthContextData, useAuth } from '@contexts/AuthContext';
import { PageLayout } from '@layouts/PageLayout';
import { Button, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { getObjectDiff } from '@utils';
import clsx from 'clsx';
import { DetailedHTMLProps, FC, HTMLAttributes, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Lock } from 'tabler-icons-react';

import { User } from '@prom-cms/api-client';

import { LanguageSelect } from './-components';

const Row: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, children, ...rest }) => (
  <div className={clsx('grid grid-cols-2 gap-6', className)} {...rest}>
    {children}
  </div>
);

export const Route = createLazyFileRoute('/_authorized/settings/profile/')({
  component: Page,
});

function Page() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const formMethods = useForm({
    defaultValues: user ?? undefined,
  });
  const { register, control, handleSubmit, watch } = formMethods;

  const values = watch();

  const canSubmit = useMemo(() => {
    return !!Object.keys(getObjectDiff(user, values)).length;
  }, [user, values]);

  const onSubmit = async (values) => {
    const id = 'update-profile-settings-notification';

    showNotification({
      id,
      loading: true,
      title: 'Updating',
      message: t('Updating your data, please wait...'),
      autoClose: false,
      disallowClose: true,
    });

    const diffedUser = getObjectDiff(user, values) as User;

    try {
      await apiClient.profile.update(diffedUser);
      await refetchAuthContextData();

      updateNotification({
        id,
        message: t('Update done!'),
        autoClose: 2000,
      });
    } catch (e) {
      updateNotification({
        id,
        color: 'red',
        message: t('An error happened'),
        autoClose: 2000,
      });
    }
  };

  return (
    <PageLayout>
      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 w-full max-w-6xl gap-8 pb-5 flex flex-col md:flex-row"
          autoComplete="off"
        >
          <Controller
            control={control}
            name="avatar"
            render={({ field: { onChange, onBlur, value } }) => (
              <ImageSelect
                label={t('Avatar')}
                selected={value}
                multiple={false}
                onChange={(value) => value && onChange(value)}
                onBlur={onBlur}
              />
            )}
          />
          <div className="grid gap-4 w-full">
            <Row>
              <TextInput
                label={t('Full name')}
                className="w-full"
                {...register('name')}
              />
            </Row>
            <Row className="items-end">
              <TextInput
                disabled
                label="Email"
                className="w-full"
                {...register('email')}
              />
              <Button
                className="block mt-1"
                color="ghost"
                size="md"
                leftIcon={<Lock />}
                onClick={() =>
                  navigate({ to: '/settings/profile/password/change' })
                }
              >
                {t(MESSAGES.CHANGE_PASSWORD)}
              </Button>
            </Row>
            <Row className="items-end">
              <LanguageSelect />
            </Row>
            <Button
              className="mt-10 max-w-[150px]"
              size="md"
              color="success"
              type="submit"
              disabled={!canSubmit}
              loading={formMethods.formState.isSubmitting}
            >
              {t('Save')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </PageLayout>
  );
}
