import { apiClient } from '@api';
import ImageSelect from '@components/form/ImageSelect';
import { MESSAGES } from '@constants';
import { Page } from '@custom-types';
import { UnderpageLayout } from '@layouts';
import { Button, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { getObjectDiff } from '@utils';
import clsx from 'clsx';
import { useGlobalContext } from 'contexts/GlobalContext';
import { DetailedHTMLProps, FC, HTMLAttributes, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'tabler-icons-react';

import { User } from '@prom-cms/api-client';

import { LanguageSelect } from './_components';

const Row: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, children, ...rest }) => (
  <div className={clsx('grid grid-cols-2 gap-6', className)} {...rest}>
    {children}
  </div>
);

export const ProfileSettingsPage: Page = () => {
  const { currentUser, updateValue } = useGlobalContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const formMethods = useForm({
    defaultValues: currentUser,
  });
  const { register, control, handleSubmit, watch } = formMethods;

  const values = watch();

  const canSubmit = useMemo(() => {
    return !!Object.keys(getObjectDiff(currentUser, values)).length;
  }, [currentUser, values]);

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

    const diffedUser = getObjectDiff(currentUser, values) as User;

    try {
      await apiClient.profile.update(diffedUser);

      updateValue('currentUser', {
        ...currentUser,
        ...diffedUser,
      } as typeof currentUser);

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
              onClick={() => navigate('/settings/profile/password/change')}
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
  );
};
