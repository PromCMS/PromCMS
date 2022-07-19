import { VFC } from 'react';
import { Textarea as MantineTextarea } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

export const Textarea: VFC = () => {
  const { t } = useTranslation();
  const { register } = useFormContext();

  return (
    <MantineTextarea
      autosize
      label={t('Value')}
      minRows={4}
      {...register('content.data')}
    />
  );
};
