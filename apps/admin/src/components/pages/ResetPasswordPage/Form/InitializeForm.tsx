import { yupResolver } from '@hookform/resolvers/yup';
import { useNotifications } from '@mantine/notifications';
import axios from 'axios';
import { ProfileService } from '@services';
import { VFC } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';

import { initializeResetPasswordFormSchema } from './schema';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Paper, TextInput } from '@mantine/core';
import { Check } from 'tabler-icons-react';

type FormValues = {
  email: string;
};

export const InitializeForm: VFC = () => {
  const { t } = useTranslation();
  const notifications = useNotifications();
  const formMethods =
    useForm <
    FormValues >
    {
      resolver: yupResolver(initializeResetPasswordFormSchema),
      defaultValues: {
        email: '',
      },
    };
  const { register, formState, handleSubmit, watch } = formMethods;

  const providedEmail = watch('email');

  const onSubmitCallback: SubmitHandler<FormValues> = async ({ email }) => {
    try {
      await ProfileService.requestPasswordReset({ email });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        notifications.showNotification({
          id: 'reset-password-request-notification',
          color: 'red',
          title: 'An error happened',
          message: 'An error happened during request. Please try again...',
        });
        throw e;
      }
    }
  };

  return (
    <FormProvider {...formMethods}>
      <div className="flex min-h-screen w-full">
        <div className="m-auto w-full max-w-lg">
          <h1 className="mb-3 ml-5 text-2xl font-semibold">
            {t('Reset password')}
          </h1>
          <form onSubmit={handleSubmit(onSubmitCallback)}>
            <Paper shadow="xl" p="md" withBorder className="w-full">
              {!formState.isSubmitSuccessful ? (
                <>
                  <TextInput
                    label="Your email"
                    className="w-full"
                    type="email"
                    error={t(formState.errors.email?.message || '')}
                    {...register('email')}
                  />
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
                    <Check className="mx-auto aspect-square w-16 text-green-400" />
                    <p className="mt-3 text-xl">
                      <Trans
                        i18nKey={
                          'Please check your inbox on {{providedEmail}} and follow instructions there.'
                        }
                        providedEmail={providedEmail}
                      >
                        Please check your inbox on <b>{{ providedEmail }}</b>{' '}
                        and follow instructions there.
                      </Trans>
                    </p>
                    <Link href="/login">
                      <a className="mt-5 block font-semibold text-blue-400 hover:underline">
                        {t('Back to login')}
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
