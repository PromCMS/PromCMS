import { SelectItem, Select } from '@mantine/core';
import { ColumnTypeEnum } from '@prom-cms/schema';
import { capitalizeFirstLetter } from '@prom-cms/shared';
import { FC, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export interface EnumSelectProps extends ColumnTypeEnum {
  columnName: string;
  error: string;
  disabled?: boolean;
}

export const EnumSelect: FC<EnumSelectProps> = ({
  columnName,
  title,
  error,
  enum: enumValue,
  disabled,
}) => {
  const { t } = useTranslation();

  const enumValues = useMemo<SelectItem[]>(
    () =>
      enumValue.map((enumKey) => ({
        value: enumKey,
        label: t(capitalizeFirstLetter(enumKey)),
      })),
    [enumValue, t]
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
          shadow="xl"
          error={error}
          disabled={disabled}
        />
      )}
    />
  );
};
