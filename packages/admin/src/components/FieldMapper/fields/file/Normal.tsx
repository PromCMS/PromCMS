import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { z } from 'zod';
import { FileSelect } from '@components/form/FileSelect';
import { columnTypeFileSchema } from '@prom-cms/schema';

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
      <FileSelect
        onChange={onChange}
        selected={String(value)}
        error={errorMessage}
        label={label}
        {...(rest as any)}
      />
    )}
  />
);
