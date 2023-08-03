import ImageSelect from '@components/form/ImageSelect';
import { columnTypeFileSchema } from '@prom-cms/schema';
import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

export type SmallImageProps = {
  name: string;
  errorMessage?: string;
  label?: string;
} & z.infer<typeof columnTypeFileSchema>;

export const SmallImage: FC<SmallImageProps> = ({
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
