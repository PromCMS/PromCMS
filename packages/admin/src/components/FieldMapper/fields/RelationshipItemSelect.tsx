import { MESSAGES, pageUrls } from '@constants';
import { useModelItems } from '@hooks/useModelItems';
import { Select, SelectItem, Text } from '@mantine/core';
import { ColumnTypeRelationship } from '@prom-cms/schema';
import { UserRole } from '@prom-cms/shared';
import Mustache from 'mustache';
import { useMemo } from 'react';
import { FC } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'tabler-icons-react';

export interface RelationshipItemSelectProps
  extends Omit<ColumnTypeRelationship, 'title'> {
  columnName: string;
  error: string;
  disabled?: boolean;
  title?: string;
}

export const RelationshipItemSelect: FC<RelationshipItemSelectProps> = ({
  columnName,
  title,
  error,
  targetModel,
  labelConstructor,
  disabled,
}) => {
  const { field } = useController<Record<string, string>>({
    name: columnName,
  });
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
    <div className="w-full">
      <Select
        data={values}
        key={columnName}
        label={title}
        value={field.value ? String(field.value) : null}
        onChange={field.onChange}
        className="w-full"
        placeholder={t('Select an option')}
        shadow="xl"
        disabled={isError || isLoading || disabled}
        error={error}
      />
      {field.value && !Array.isArray(field.value) ? (
        <Link
          target="_blank"
          to={pageUrls.entryTypes(targetModel).view(field.value)}
        >
          <Text size="sm" color="blue">
            <ExternalLink size={15} className="mr-1 relative top-0.5" />
            {MESSAGES.SHOW_SELECTED_ITEM}
          </Text>
        </Link>
      ) : null}
    </div>
  );
};
