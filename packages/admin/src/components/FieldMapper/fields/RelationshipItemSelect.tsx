import { useModelItems } from '@hooks/useModelItems';
import { Select, SelectItem } from '@mantine/core';
import { ColumnTypeRelationship } from '@prom-cms/schema';
import { UserRole } from '@prom-cms/shared';
import Mustache from 'mustache';
import { useMemo } from 'react';
import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export interface RelationshipItemSelectProps extends ColumnTypeRelationship {
  columnName: string;
  error: string;
  disabled?: boolean;
}

export const RelationshipItemSelect: FC<RelationshipItemSelectProps> = ({
  columnName,
  title,
  error,
  targetModel,
  labelConstructor,
  disabled,
}) => {
  const { t } = useTranslation();
  const { data, isError, isLoading } = useModelItems<UserRole>(targetModel, {});

  const values = useMemo<SelectItem[]>(
    () =>
      (data?.data ?? []).map((entry) => ({
        value: String(entry.id),
        label: Mustache.render(labelConstructor, entry),
      })),
    [data, t, labelConstructor]
  );

  return (
    <Controller
      name={columnName}
      render={({ field: { onChange, value } }) => (
        <Select
          data={values}
          key={columnName}
          label={title}
          value={String(value)}
          onChange={onChange}
          className="w-full"
          placeholder={t('Select an option')}
          shadow="xl"
          disabled={isError || isLoading || disabled}
          error={error}
        />
      )}
    />
  );
};
