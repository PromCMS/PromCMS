import { useModelItems } from '@hooks/useModelItems';
import { Select, SelectItem } from '@mantine/core';
import {
  ModelColumnName,
  PagedResult,
  RelationshipColumnType,
  UserRole,
} from '@prom-cms/shared';
import { useMemo } from 'react';
import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export interface RelationshipItemSelectProps extends RelationshipColumnType {
  columnName: ModelColumnName;
  error: string;
}

export const RelationshipItemSelect: FC<RelationshipItemSelectProps> = ({
  columnName,
  title,
  error,
  targetModel,
  labelConstructor,
}) => {
  const { t } = useTranslation();
  const { data, isError, isLoading } = useModelItems<PagedResult<UserRole>>(
    targetModel,
    {}
  );

  const values = useMemo<SelectItem[]>(
    () =>
      (data?.data ?? []).map(({ id, ...rest }) => ({
        value: String(id),
        // TODO: make label constructor
        label: t(rest[labelConstructor]),
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
          disabled={isError || isLoading}
          error={error}
        />
      )}
    />
  );
};
