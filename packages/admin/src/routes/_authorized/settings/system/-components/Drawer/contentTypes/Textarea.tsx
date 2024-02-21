import { MESSAGES } from '@constants';
import { Textarea as MantineTextarea } from '@mantine/core';
import { VFC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const Textarea: VFC = () => {
  const { t } = useTranslation();
  const { register } = useFormContext();

  return (
    <MantineTextarea
      autosize
      label={t(MESSAGES.VALUE)}
      minRows={4}
      {...register('content.data')}
    />
  );
};
