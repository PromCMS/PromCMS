import { NumberInput } from '@mantine/core';
import Mustache from 'mustache';
import { FC, useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { ColumnTypeNumber } from '@prom-cms/schema';

export const NumberField: FC<
  { columnName: string; disabled?: boolean; error?: string } & ColumnTypeNumber
> = ({
  columnName,
  title,
  error,
  disabled,
  suffix: suffixTemplate,
  prefix: prefixTemplate,
}) => {
  const { watch } = useFormContext();
  const { field } = useController({
    name: columnName,
  });

  const [suffix, setSuffix] = useState<string>();
  const [prefix, setPrefix] = useState<string>();

  useEffect(() => {
    const subscription = watch((value) => {
      if (prefixTemplate) {
        setPrefix(Mustache.render(prefixTemplate, value));
      }

      if (suffixTemplate) {
        setSuffix(Mustache.render(suffixTemplate, value));
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, suffixTemplate, prefixTemplate]);

  return (
    <NumberInput
      label={title}
      className="w-full"
      autoComplete="off"
      error={error}
      thousandSeparator=" "
      disabled={disabled}
      value={field.value}
      name={field.name}
      onBlur={field.onBlur}
      ref={field.ref}
      suffix={suffix}
      prefix={prefix}
      onChange={(value) => {
        if (value === '') {
          field.onChange(undefined);
          return;
        }

        field.onChange(value);
      }}
    />
  );
};
