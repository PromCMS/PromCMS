import { apiClient } from '@api';
import { MESSAGES } from '@constants';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Group,
  Image,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from '@mantine/core';
import { createLogger, isApiResponse } from '@utils';
import axios from 'axios';
import clsx from 'clsx';
import { useGlobalContext } from 'contexts/GlobalContext';
import { FC } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import {
  ItemID,
  LoginFailedResponseCodes,
  UserRole,
} from '@prom-cms/api-client';

import logoImage from '../../../assets/logos/logo.svg';
import { loginFormSchema } from '../_schema';

interface LoginFormValues {
  email: string;
  password: string;
}

const logger = createLogger('Login Form');

export const Form: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { updateValue } = useGlobalContext();
  const formMethods = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit, formState, setError, register } = formMethods;

  const onSubmitCallback: SubmitHandler<LoginFormValues> = async ({
    password,
    email,
  }) => {
    try {
      const {
        data: { data: user },
      } = await apiClient.auth.login({ password, email });
      const currentUserRoleQuery = await apiClient.userRoles.getOne(
        user.role as ItemID
      );

      // set current user since we are logged in
      updateValue('currentUser', {
        ...user,
        role: currentUserRoleQuery.data.data,
      });

      // push user to main page
      navigate('/');
    } catch (e) {
      logger.error(`Failed login because of ${(e as Error).message}`);

      let message: string = MESSAGES.LOGIN_INVALID_CREDENTIALS;
      if (
        axios.isAxiosError(e) &&
        isApiResponse<unknown, LoginFailedResponseCodes>(e.response)
      ) {
        const { code } = e.response.data;

        switch (code) {
          case 'user-state-blocked':
            message = MESSAGES.LOGIN_USER_BLOCKED;
            break;
          case 'user-state-invited':
            message = MESSAGES.LOGIN_USER_INVITED;
            break;
          case 'user-state-password-reset':
            message = MESSAGES.LOGIN_USER_PASSWORD_RESET;
            break;
          default:
            break;
        }
      }
      setError('password', { message: t(message) });
      setError('email', { message: ' ' });
    }
  };

  return (
    <FormProvider {...formMethods}>
      <div className="flex flex-col min-h-screen w-full">
        <Image
          height={50}
          width={50}
          src={logoImage}
          alt=""
          fit="contain"
          classNames={{
            imageWrapper: clsx('p-5'),
          }}
        />
        <div className="m-auto w-full max-w-md">
          <Title className="text-2xl font-semibold mb-3 ">
            {t(MESSAGES.LOGIN_TO_MY_ACCOUNT)}
          </Title>
          <form onSubmit={handleSubmit(onSubmitCallback)}>
            <Paper shadow="xl" p="md" withBorder className="w-full">
              <div className="grid w-full gap-3">
                <TextInput
                  label={t('Email')}
                  type="email"
                  error={t(
                    formState?.errors?.email?.message as unknown as string
                  )}
                  className="w-full"
                  autoComplete="email"
                  {...register('email')}
                />
                <Group position="right" className="z-10 -mb-12">
                  <Link to="/reset-password">{t('Forgot password?')}</Link>
                </Group>
                <PasswordInput
                  label={t('Password')}
                  error={t(
                    formState?.errors?.password?.message as unknown as string
                  )}
                  className="w-full"
                  autoComplete="current-password"
                  {...register('password')}
                />
              </div>
              <Button
                loading={formState.isSubmitting}
                type="submit"
                color="green"
                size="md"
                className="mt-7"
              >
                {t(formState.isSubmitting ? 'Working...' : 'Log in')}
              </Button>
            </Paper>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};
