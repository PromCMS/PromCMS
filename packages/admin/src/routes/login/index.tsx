import { apiClient } from '@api';
import { MESSAGES } from '@constants';
import { refetchAuthContextData } from '@contexts/AuthContext';
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
import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router';
import { createLogger, isApiResponse } from '@utils';
import axios from 'axios';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { LoginFailedResponseCodes } from '@prom-cms/api-client';

import logoImage from '../../assets/logos/logo.svg';

export const Route = createFileRoute('/login/')({
  component: LoginPage,
  beforeLoad({ context }) {
    if (context.auth?.user) {
      throw redirect({
        to: '/',
      });
    }
  },
});

interface LoginFormValues {
  email: string;
  password: string;
}

const logger = createLogger('Login Form');
export const loginFormSchema = z
  .object({
    password: z.string({ required_error: MESSAGES.PLEASE_ENTER_PASSWORD }),
    email: z.string({ required_error: MESSAGES.PLEASE_ENTER_EMAIL }),
  })
  .strict();

function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      // Try to authorize
      await apiClient.auth.login({ password, email });
      await refetchAuthContextData();

      navigate({
        to: '/',
      });
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
          height={75}
          width={75}
          src={logoImage}
          style={{ width: 75 }}
          alt=""
          fit="contain"
          p="sm"
        />
        <div className="m-auto w-full max-w-lg">
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
                <Group justify="end" className="z-10 -mb-12">
                  <Link to="/reset-password">
                    {t(MESSAGES.PASSWORD_RESET_PAGE_TITLE)}
                  </Link>
                </Group>
                <PasswordInput
                  label={t(MESSAGES.PASSWORD)}
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
}
