import { apiClient } from '@api';
import { Page } from '@custom-types';
import { ChangePasswordErrorCode } from '@prom-cms/api-client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal, PasswordInput, Title } from '@mantine/core';
import axios from 'axios';
import * as yup from 'yup';
import { useCallback } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import { MESSAGES } from '@constants';
import { isApiResponse, toastedPromise } from '@utils';

type FormValues = {
  newPassword: string;
  oldPassword: string;
  newPasswordAgain: string;
};

const schema = yupResolver(
  yup.object({
    newPassword: yup
      .string()
      .min(6, t('Too short, minimum 6 characters'))
      .required(t(MESSAGES.FIELD_REQUIRED)),
    newPasswordAgain: yup
      .string()
      .oneOf([yup.ref('newPassword'), null], MESSAGES.PASSWORDS_MUST_MATCH),
    oldPassword: yup.string().required(t(MESSAGES.FIELD_REQUIRED)),
  })
);

export const ChangePasswordPage: Page = () => {
  const navigate = useNavigate();
  const formMethods = useForm<FormValues>({
    resolver: schema,
  });
  const { t } = useTranslation();
  const { handleSubmit, formState, register, setError } = formMethods;

  const onClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (confirm(t(MESSAGES.ARE_YOUR_REALLY_SURE))) {
      try {
        await toastedPromise(
          {
            title: t(MESSAGES.CHANGE_PASSWORD),
            message: t(MESSAGES.PLEASE_WAIT),
            successMessage: t('Password changed successfully. Logging off...'),
          },
          async () => {
            await apiClient.profile.changePassword(
              values.newPassword,
              values.oldPassword
            );
          }
        );

        navigate('/logout');
      } catch (e) {
        if (
          axios.isAxiosError(e) &&
          isApiResponse<unknown, ChangePasswordErrorCode>(e.response)
        ) {
          const { code } = e.response?.data;

          if (code === 'old-password-invalid') {
            setError('oldPassword', {
              message: MESSAGES.INVALID_OLD_PASSWORD,
            });
          }
        }

        throw e;
      }
    }
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      centered
      padding={32}
      size={500}
      className="overflow-auto"
      title={<Title order={4}>{t('Change password')}</Title>}
    >
      <FormProvider {...formMethods}>
        <form className="h-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full max-w-lg gap-4">
            <PasswordInput
              label={t(MESSAGES.OLD_PASSWORD)}
              className="w-full"
              error={formState.errors.oldPassword?.message}
              autoComplete="current-password"
              {...register('oldPassword')}
            />
            <hr className="bg-gray-200 border-none h-0.5 w-full my-0" />
            <PasswordInput
              label={t(MESSAGES.NEW_PASSWORD)}
              className="w-full"
              error={formState.errors.newPassword?.message}
              autoComplete="new-password"
              {...register('newPassword')}
            />
            <PasswordInput
              label={t(MESSAGES.NEW_PASSWORD_AGAIN)}
              className="w-full"
              error={formState.errors.newPasswordAgain?.message}
              autoComplete="off"
              {...register('newPasswordAgain')}
            />
          </div>
          <Button
            loading={formState.isSubmitting}
            type="submit"
            className="mt-5"
            loaderPosition="right"
          >
            {t('Save')}
          </Button>
        </form>
      </FormProvider>
    </Modal>
  );
};
