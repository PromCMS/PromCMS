import { useGlobalContext } from '@contexts/GlobalContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProfileService } from '@services';
import { useRouter } from 'next/router';
import { VFC } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { FirstStep } from '.';
import { loginFormSchema } from './schema';
import { LoginFailedResponseCodes } from '@prom-cms/shared';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Paper, Title } from '@mantine/core';
import { MESSAGES } from '@constants';
import axios from 'axios';

interface LoginFormValues {
  email: string;
  step: number;
  password: string;
  mfaImageUrl?: string;
}

export const Form: VFC = () => {
  const { push } = useRouter();
  const { t } = useTranslation();
  const { updateValue } = useGlobalContext();
  const formMethods = useForm<LoginFormValues>({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      step: 0,
      email: '',
      password: '',
      mfaImageUrl: '',
    },
  });

  const { watch, handleSubmit, formState, setError } = formMethods;
  const step = watch('step');
  const humanStep = step + 1;

  const onSubmitCallback: SubmitHandler<LoginFormValues> = async ({
    password,
    step,
    email,
  }) => {
    switch (step) {
      case 0:
        try {
          const { data } = await ProfileService.login({ password, email });
          // set current user since we are logged in
          updateValue('currentUser', data.data);

          // push user to main page
          push('/');
        } catch (e) {
          let message = MESSAGES.LOGIN_INVALID_CREDENTIALS;
          if (axios.isAxiosError(e) && e.response?.data?.code) {
            const code: LoginFailedResponseCodes = e.response.data.code;

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
        break;
      default:
        console.error(`There are not implemented that many steps... (${step})`);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <div className="flex min-h-screen w-full">
        <div className="m-auto w-full max-w-lg">
          <Title className="mb-3 ml-5 text-2xl font-semibold">
            <Trans i18nKey="Log in (step ...)" humanStep={humanStep}>
              Log in (step <strong>{{ humanStep }}</strong>).
            </Trans>
          </Title>
          <form onSubmit={handleSubmit(onSubmitCallback)}>
            <Paper shadow="xl" p="md" withBorder className="w-full">
              {step === 0 && <FirstStep />}
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
