import { useModelItem } from '@hooks/useModelItem';
import { useModelItems } from '@hooks/useModelItems';
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  Skeleton,
  Text,
} from '@mantine/core';
import { PagedResult, User, UserRole } from '@prom-cms/shared';
import { t } from 'i18next';
import { forwardRef } from 'react';
import { FC } from 'react';

interface AutoCompleteItemProps extends User {}

const AutoCompleteItem = forwardRef<HTMLDivElement, AutoCompleteItemProps>(
  function AutoCompleteItem(
    { avatar, email, id, name, password, role, state, ...others },
    ref
  ) {
    const { data, isLoading } = useModelItem<UserRole>(
      'userroles',
      role as number
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
  onItemSubmit: (item: AutocompleteItem & User) => void;
}

export const UserSelect: FC<UserSelectProps> = ({ ...props }) => {
  const { data } = useModelItems<PagedResult<User>>(
    'users',
    {
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
    {
      isPaused: () => !props.value,
    }
  );

  return (
    <>
      <Autocomplete
        label="User"
        itemComponent={AutoCompleteItem}
        placeholder={t('Start typing to see options')}
        filter={() => true}
        nothingFound={
          !!props.value ? <div>{t('Nothing has been found')}</div> : undefined
        }
        {...props}
        data={(data?.data || []).map((item) => ({
          ...item,
          value: String(item.name),
        }))}
      />
    </>
  );
};
