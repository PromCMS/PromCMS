import { BASE_PROM_ENTITY_TABLE_NAMES, MESSAGES } from '@constants';
import { useUserRole } from '@hooks/useUserRole';
import {
  Autocomplete,
  AutocompleteProps,
  ComboboxStringData,
  Skeleton,
  Text,
} from '@mantine/core';
import { useModelItems } from 'hooks/useModelItems';
import { forwardRef } from 'react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { User } from '@prom-cms/api-client';

interface AutoCompleteItemProps extends User {}

const AutoCompleteItem = forwardRef<HTMLDivElement, AutoCompleteItemProps>(
  function AutoCompleteItem(
    { avatar, email, id, name, password, role, state, ...others },
    ref
  ) {
    const { data, isLoading } = useUserRole(
      typeof role === 'string' ? role : role?.id
    );

    return (
      <div ref={ref} {...others}>
        <Text>{name}</Text>
        <Text size="xs" color="blue">
          {!data || isLoading ? (
            <Skeleton width={100} height={20} />
          ) : (
            data.label
          )}
        </Text>
      </div>
    );
  }
);

export interface UserSelectProps
  extends Omit<AutocompleteProps, 'data' | 'onItemSubmit'> {
  onItemSubmit: (item: ComboboxStringData & User) => void;
  /**
   * @defaultValue true
   */
  withLabel?: boolean;
}

export const UserSelect: FC<UserSelectProps> = ({
  withLabel = true,
  ...props
}) => {
  const { t } = useTranslation();
  const { data } = useModelItems<User>(
    BASE_PROM_ENTITY_TABLE_NAMES.USERS,
    {
      params: {
        limit: 5,
        where: {
          ...(props.value && Number.isNaN(Number(props.value))
            ? {
                name: {
                  manipulator: 'LIKE',
                  value: `%${props.value}%`,
                },
              }
            : {}),
          ...(props.value && !Number.isNaN(Number(props.value))
            ? {
                id: {
                  manipulator: 'LIKE',
                  value: props.value,
                },
              }
            : {}),
        },
      },
    },
    {
      enabled: !!props.value,
    }
  );

  return (
    <Autocomplete
      label={withLabel ? t(MESSAGES.USER) : undefined}
      placeholder={t('Start typing to see options')}
      {...props}
      data={(data?.data || []).map((item) => ({
        ...item,
        value: String(item.name),
      }))}
    />
  );
};
