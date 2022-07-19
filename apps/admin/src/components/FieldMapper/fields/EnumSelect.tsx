import { SelectItem, Select } from '@mantine/core';
import {
  EnumColumnType,
  ModelColumnName,
  capitalizeFirstLetter,
} from '@prom-cms/shared';
import { VFC, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export interface EnumSelectProps extends EnumColumnType {
  columnName: ModelColumnName;
  error: string;
}

export const EnumSelect: VFC<EnumSelectProps> = ({
  columnName,
  title,
  error,
  enum: enumValue,
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
        />
      )}
    />
  );
};
