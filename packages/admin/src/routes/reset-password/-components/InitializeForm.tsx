import { apiClient } from '@api';
import { MESSAGES } from '@constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Paper, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Link } from '@tanstack/react-router';
import axios from 'axios';
import { FC } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { Check } from 'tabler-icons-react';

import { initializeResetPasswordFormSchema } from './schema';

type FormValues = {
  email: string;
};

export const InitializeForm: FC = () => {
  const { t } = useTranslation();
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(initializeResetPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });
  const { register, formState, handleSubmit, watch } = formMethods;

  const providedEmail = watch('email');

  const onSubmitCallback: SubmitHandler<FormValues> = async ({ email }) => {
    try {
      await apiClient.profile.requestPasswordReset(email);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        notifications.show({
          color: 'red',
          title: MESSAGES.ERROR_BASIC,
          message: MESSAGES.ERROR_RETRY,
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
            {t(MESSAGES.PASSWORD_RESET_PAGE_TITLE)}
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
                    {t(
                      formState.isSubmitting
                        ? MESSAGES.DOING_WORKING
                        : MESSAGES.SEND
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <Check className="mx-auto aspect-square w-16 text-green-400" />
                    <p className="mt-3 text-xl">
                      <Trans
                        i18nKey={MESSAGES.PASSWORD_RESET_DONE_MESSAGE}
                        values={{ providedEmail }}
                        components={{ 1: <b /> }}
                      >
                        {MESSAGES.PASSWORD_RESET_DONE_MESSAGE}
                      </Trans>
                    </p>
                    <Link
                      to="/login"
                      className="mt-5 block font-semibold text-blue-400 hover:underline"
                    >
                      {t(MESSAGES.GO_BACK_TO_LOGIN)}
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
