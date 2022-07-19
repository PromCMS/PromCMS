import { yupResolver } from '@hookform/resolvers/yup';
import { useNotifications } from '@mantine/notifications';
import axios from 'axios';
import { ProfileService } from '@services';
import { VFC } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';

import { finalizeRegistrationFormSchema } from './schema';
import { useTranslation } from 'react-i18next';
import { Button, Paper, PasswordInput } from '@mantine/core';
import { Check, X } from 'tabler-icons-react';

type FormValues = {
  new_password: string;
  confirmed_new_password: string;
  token: string;
};

export const Form: VFC<{ token?: string }> = ({ token }) => {
  const { t } = useTranslation();
  const notifications = useNotifications();
  const formMethods = useForm<FormValues>({
    resolver: yupResolver(finalizeRegistrationFormSchema),
    defaultValues: {
      new_password: '',
      confirmed_new_password: '',
      token,
    },
  });
  const { register, formState, handleSubmit, setError } = formMethods;

  const onSubmitCallback: SubmitHandler<FormValues> = async ({
    confirmed_new_password,
    ...values
  }) => {
    try {
      await ProfileService.finalizePasswordReset(values);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status) {
          setError('token', { message: 'Your token seems expired...' });
        } else {
          notifications.showNotification({
            id: 'reset-password-finalization-notification',
            color: 'red',
            title: 'An error happened',
            message: 'An error happened during request. Please try again...',
          });
        }

        throw e;
      }
    }
  };

  const tokenErrorMessage = formState.errors.token?.message;
  const tokenFailed = !!tokenErrorMessage;

  return (
    <FormProvider {...formMethods}>
      <div className="flex min-h-screen w-full">
        <div className="m-auto w-full max-w-lg">
          <h1 className="mb-1 ml-5 text-2xl font-semibold">{t('Welcome!')}</h1>
          <p className="ml-5 mb-7 font-semibold text-blue-400">
            You are so close to completing registration! Please enter your
            desired password and continue.
          </p>
          <form onSubmit={handleSubmit(onSubmitCallback)}>
            <Paper shadow="xl" p="md" withBorder className="w-full">
              {!formState.isSubmitSuccessful && !tokenFailed ? (
                <>
                  <div className="grid gap-5">
                    <PasswordInput
                      label={t('Your new password')}
                      className="w-full"
                      error={t(formState.errors.new_password?.message || '')}
                      {...register('new_password')}
                    />
                    <PasswordInput
                      label={t('Your new password again')}
                      className="w-full"
                      error={t(
                        formState.errors.confirmed_new_password?.message || ''
                      )}
                      {...register('confirmed_new_password')}
                    />
                  </div>
                  <Button
                    loading={formState.isSubmitting}
                    type="submit"
                    color="green"
                    size="md"
                    className="mt-7"
                  >
                    {t(formState.isSubmitting ? 'Working...' : 'Send')}
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-center">
                    {tokenFailed ? (
                      <X className="mx-auto aspect-square w-16 text-red-400" />
                    ) : (
                      <Check className="mx-auto aspect-square w-16 text-green-400" />
                    )}
                    <p className="mt-3 text-xl">
                      {t(
                        tokenFailed
                          ? tokenErrorMessage
                          : 'We are done here! You can login and start working.'
                      )}
                    </p>
                    <Link href="/login">
                      <a className="mt-5 block font-semibold text-blue-400 hover:underline">
                        {t('Login to my account')}
                      </a>
                    </Link>
                  </div>
                </>
              )}
            </Paper>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};
