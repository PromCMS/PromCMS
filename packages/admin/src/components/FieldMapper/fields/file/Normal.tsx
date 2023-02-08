import ImageSelect from '@components/form/ImageSelect';
import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { columnTypeFileSchema } from '@prom-cms/shared';
import { z } from 'zod';

export type NormalProps = {
  name: string;
  errorMessage?: string;
  label?: string;
} & z.infer<typeof columnTypeFileSchema>;

export const Normal: FC<NormalProps> = ({
  name,
  label,
  errorMessage,
  ...rest
}) => (
  <Controller
    name={name}
    render={({ field: { onChange, value } }) => (
      <ImageSelect
        onChange={onChange}
        selected={String(value)}
        error={errorMessage}
        label={label}
        {...(rest as any)}
      />
    )}
  />
);
