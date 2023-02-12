import { Group, PasswordInput, TextInput } from '@mantine/core';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const FirstStep: FC = () => {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid w-full gap-3">
      <TextInput
        label={t('Email')}
        type="email"
        error={t(errors?.email?.message as unknown as string)}
        className="w-full"
        autoComplete="email"
        {...register('email')}
      />
      <Group position="right" className="z-10 -mb-12">
        <Link to="/reset-password">{t('Forgot password?')}</Link>
      </Group>
      <PasswordInput
        label={t('Password')}
        error={t(errors?.password?.message as unknown as string)}
        className="w-full"
        autoComplete="current-password"
        {...register('password')}
      />
    </div>
  );
};
