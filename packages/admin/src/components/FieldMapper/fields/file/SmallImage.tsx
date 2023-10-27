import ImageSelect from '@components/form/ImageSelect';
import { columnTypeFileSchema } from '@prom-cms/schema';
import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

export type SmallImageProps = {
  name: string;
  errorMessage?: string;
  label?: string;
  disabled?: boolean;
} & z.infer<typeof columnTypeFileSchema>;

export const SmallImage: FC<SmallImageProps> = ({
  name,
  label,
  errorMessage,
  disabled,
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
        disabled={disabled}
        {...(rest as any)}
      />
    )}
  />
);
