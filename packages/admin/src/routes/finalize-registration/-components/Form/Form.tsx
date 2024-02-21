import { apiClient } from '@api';
import { MESSAGES } from '@constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Paper, PasswordInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Link, useParams } from '@tanstack/react-router';
import axios from 'axios';
import { FC } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Check, X } from 'tabler-icons-react';

import { FinalizeRegistrationRoute } from '../../index';
import { finalizeRegistrationFormSchema } from './schema';

type FormValues = {
  new_password: string;
  confirmed_new_password: string;
  token: string;
};

export const Form: FC = () => {
  const { t } = useTranslation();
  const { token } = useParams({
    from: FinalizeRegistrationRoute.id,
  });
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(finalizeRegistrationFormSchema),
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
      await apiClient.profile.finalizePasswordReset(values);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status) {
          setError('token', { message: MESSAGES.PASSWORD_RESET_TOKEN_EXPIRED });
        } else {
          notifications.show({
            color: 'red',
            title: MESSAGES.ERROR_BASIC,
            message: MESSAGES.ERROR_RETRY,
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
          <h1 className="mb-1 ml-5 text-2xl font-semibold">
            {t(MESSAGES.REGISTER_FINALIZE_PAGE_TITLE)}
          </h1>
          <p className="ml-5 mb-7 font-semibold text-blue-400">
            {t(MESSAGES.REGISTER_FINALIZE_PAGE_SUBTITLE)}
          </p>
          <form onSubmit={handleSubmit(onSubmitCallback)}>
            <Paper shadow="xl" p="md" withBorder className="w-full">
              {!formState.isSubmitSuccessful && !tokenFailed ? (
                <>
                  <div className="grid gap-5">
                    <PasswordInput
                      label={t(MESSAGES.PASSWORD_RESET_INPUT)}
                      className="w-full"
                      error={t(formState.errors.new_password?.message || '')}
                      {...register('new_password')}
                    />
                    <PasswordInput
                      label={t(MESSAGES.PASSWORD_RESET_INPUT_AGAIN)}
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
                    {tokenFailed ? (
                      <X className="mx-auto aspect-square w-16 text-red-400" />
                    ) : (
                      <Check className="mx-auto aspect-square w-16 text-green-400" />
                    )}
                    <p className="mt-3 text-xl">
                      {t(
                        tokenFailed
                          ? tokenErrorMessage
                          : MESSAGES.REGISTER_FINALIZE_PAGE_DONE
                      )}
                    </p>
                    <Link
                      to="/login"
                      className="mt-5 block font-semibold text-blue-400 hover:underline"
                    >
                      {t(MESSAGES.LOGIN_TO_MY_ACCOUNT)}
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
