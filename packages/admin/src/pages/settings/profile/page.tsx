import ImageSelect from '@components/form/ImageSelect';
import { useGlobalContext } from '@contexts/GlobalContext';
import clsx from 'clsx';
import axios from 'axios';
import {
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  useMemo,
  useState,
} from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getObjectDiff } from '@utils';
import { User } from '@prom-cms/shared';
import { showNotification, updateNotification } from '@mantine/notifications';
import { Button, TextInput, Input } from '@mantine/core';
import { Lock } from 'tabler-icons-react';
import { Page } from '@custom-types';
import { apiClient } from '@api';
import { LanguageSelect } from './_components';
import { useNavigate } from 'react-router-dom';

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
  const [isResetting, setIsResettings] = useState(false);
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

  const requestPasswordReset = async () => {
    if (confirm(t('Are you really sure?'))) {
      try {
        setIsResettings(true);
        await apiClient.users.requestPasswordReset(currentUser?.email);
        navigate('/logout');
      } catch (e) {
        setIsResettings(false);
        if (axios.isAxiosError(e)) {
          showNotification({
            id: 'reset-password-request-notification',
            color: 'red',
            title: 'An error happened',
            message: 'An error happened during request. Please try again...',
          });
          throw e;
        }
      }
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 grid w-full max-w-6xl gap-4 pb-5"
        autoComplete="off"
      >
        <Row>
          <Controller
            control={control}
            name="avatar"
            render={({ field: { onChange, onBlur, value } }) => (
              <ImageSelect
                label={t('Avatar')}
                className="w-full"
                disabled={isResetting}
                selected={value}
                multiple={false}
                onChange={(value) => value && onChange(value)}
                onBlur={onBlur}
              />
            )}
          />
        </Row>
        <Row>
          <TextInput
            label={t('Full name')}
            className="w-full"
            disabled={isResetting}
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
        </Row>
        <Row className="items-end">
          <Input.Wrapper size="md" label={t('Password')}>
            <Button
              className="block mt-1"
              color="ghost"
              size="lg"
              leftIcon={<Lock />}
              disabled={isResetting}
              onClick={requestPasswordReset}
            >
              {t('Change password')}
            </Button>
          </Input.Wrapper>
        </Row>
        <Row className="items-end">
          <LanguageSelect />
        </Row>
        <Button
          className="mt-10 max-w-[150px]"
          size="md"
          color="success"
          type="submit"
          disabled={isResetting || !canSubmit}
          loading={formMethods.formState.isSubmitting}
        >
          {t('Save')}
        </Button>
      </form>
    </FormProvider>
  );
};
