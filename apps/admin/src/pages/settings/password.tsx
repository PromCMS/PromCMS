import { MESSAGES } from '@constants';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, PasswordInput } from '@mantine/core';
import { Page } from '@custom-types';

interface FormValues {
  newPassword: string;
  oldPassword: string;
}

export const UserProfilePasswordPage: Page = () => {
  const { register } = useForm<FormValues>();
  const { t } = useTranslation();

  return (
    <form className="mt-6 w-full max-w-6xl pb-5">
      <div className="grid w-full max-w-lg gap-4">
        <PasswordInput
          label={t(MESSAGES.NEW_PASSWORD)}
          className="w-full"
          {...register('newPassword')}
        />
        <PasswordInput
          label={t(MESSAGES.OLD_PASSWORD)}
          className="w-full"
          {...register('oldPassword')}
        />
      </div>
      <Button type="submit" className="mt-5">
        {t('Save')}
      </Button>
    </form>
  );
};
