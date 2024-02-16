import { ComboboxItem, Select } from '@mantine/core';
import { upperFirst } from '@mantine/hooks';
import { FC, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ColumnTypeEnum } from '@prom-cms/schema';

export interface EnumSelectProps extends ColumnTypeEnum {
  columnName: string;
  error: string;
  disabled?: boolean;
}

export const EnumSelect: FC<EnumSelectProps> = ({
  columnName,
  title,
  error,
  enum: enumOptions,
  disabled,
}) => {
  const { t } = useTranslation();

  const enumValues = useMemo<ComboboxItem[]>(
    () =>
      Object.values(enumOptions.values).map((enumKey) => ({
        value: enumKey,
        label: t(upperFirst(enumKey)),
      })),
    [enumOptions, t]
  );

  return (
    <Controller
      name={columnName}
      render={({ field: { onChange, value } }) => (
        <Select
          data={enumValues}
          key={columnName}
          label={title}
          value={value}
          onChange={onChange}
          className="w-full"
          placeholder={t('Select an option')}
          comboboxProps={{ shadow: 'xl' }}
          error={error}
          disabled={disabled}
        />
      )}
    />
  );
};
