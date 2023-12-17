import { useModelItems } from '@hooks/useModelItems';
import { ActionIcon, Text } from '@mantine/core';
import { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';

import { ItemID, User } from '@prom-cms/api-client';

import { loadingPlaceholder } from './constants';

const Item: FC<User & { onItemDelete: (id: ItemID) => void }> = ({
  id,
  name,
  onItemDelete,
}) => {
  return (
    <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-2">
      <Text size="lg">{name}</Text>
      <ActionIcon color="red" variant="light" onClick={() => onItemDelete(id)}>
        <Trash width={20} height={20} />
      </ActionIcon>
    </div>
  );
};

export const CoeditorsList: FC = () => {
  const { watch, setValue, getValues } = useFormContext();
  const sharedWithItems = watch('coeditors');
  const hasNoItems = !Object.keys(sharedWithItems || {}).length;
  const { data: coeditors, isLoading } = useModelItems<User>(
    'users',
    {
      params: {
        limit: 999,
        where: {
          id: {
            manipulator: 'IN',
            value: Object.keys(sharedWithItems || {}),
          },
        },
      },
    },
    { enabled: !hasNoItems }
  );

  const onItemDelete = useCallback(
    (itemId) => {
      const itemKey = 'coeditors';
      const { ...values } = getValues(itemKey);

      delete values[itemId];

      setValue(itemKey, values);
    },
    [setValue, getValues]
  );

  return !isLoading || hasNoItems ? (
    <>
      {(coeditors?.data || []).map((props) => (
        <Item key={props.id} onItemDelete={onItemDelete} {...props} />
      ))}
    </>
  ) : (
    loadingPlaceholder
  );
};
