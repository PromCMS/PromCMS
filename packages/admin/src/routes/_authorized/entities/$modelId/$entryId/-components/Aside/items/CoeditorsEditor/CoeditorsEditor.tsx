import AsideItemWrap from '@components/editorialPage/AsideItemWrap';
import { UserSelect, UserSelectProps } from '@components/form/UserSelect';
import { BASE_PROM_ENTITY_TABLE_NAMES, MESSAGES } from '@constants';
import { Anchor, Button, Group, Popover } from '@mantine/core';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useCallback, useState } from 'react';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Plus } from 'tabler-icons-react';

import { useEntryUnderpageContext } from '../../../../-context';
import { CoeditorsList } from './CoeditorList';

/**
 * Should be updated to dynamic sharable permission editor
 * @returns
 */
export const CoeditorsEditor: FC = () => {
  const { itemData } = useEntryUnderpageContext();
  const currentUser = useCurrentUser();
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [selectInputValue, setSelectInputValue] = useState<string>();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { setValue, getValues } = useFormContext();
  const { t } = useTranslation();

  const onUserSelect: UserSelectProps['onItemSubmit'] = useCallback(
    ({ id }) => {
      setIsAddingUser(true);
      const sharedWithValue = getValues('coeditors') ?? {};

      setValue('coeditors', { ...sharedWithValue, [String(id)]: true });

      setIsAddingUser(false);
      setPopoverOpen(false);
      setSelectInputValue('');
    },
    [getValues, setValue]
  );

  if (
    !currentUser?.can({
      action: 'update',
      targetEntityTableName: BASE_PROM_ENTITY_TABLE_NAMES.USER_ROLES,
    }) &&
    currentUser?.id !== itemData?.created_by
  ) {
    return null;
  }

  return (
    <>
      <AsideItemWrap
        title={t(MESSAGES.CONTRIBUTORS)}
        description={t(MESSAGES.ADD_CONTRIBUTOR_TEXT)}
      >
        <div className="grid grid-cols-1 gap-2.5 p-2.5">
          <CoeditorsList />
          <Popover
            closeOnClickOutside={false}
            closeOnEscape={false}
            opened={popoverOpen}
            onClose={() => setPopoverOpen(false)}
            position="bottom"
            transitionProps={{ transition: 'pop-top-right' }}
            width={400}
          >
            <Popover.Target>
              <Button
                className="w-full"
                leftSection={<Plus className="h-7 w-7" />}
                variant="light"
                type="button"
                onClick={() => setPopoverOpen((o) => !o)}
              >
                <span className="ml-auto inline-block">
                  {t(MESSAGES.ADD_CONTRIBUTOR)}
                </span>
              </Button>
            </Popover.Target>
            <Popover.Dropdown
              className="w-full"
              title={t(MESSAGES.SELECT_USER_PLACEHOLDER)}
            >
              <UserSelect
                withLabel={false}
                disabled={isAddingUser}
                value={selectInputValue}
                onChange={setSelectInputValue}
                onItemSubmit={onUserSelect}
              />

              <Group justify="space-between" style={{ marginTop: 15 }}>
                <Anchor
                  component="button"
                  color="gray"
                  size="sm"
                  disabled={isAddingUser}
                  onClick={() => setPopoverOpen(false)}
                >
                  {t(MESSAGES.CANCEL_ACTION)}
                </Anchor>
              </Group>
            </Popover.Dropdown>
          </Popover>
        </div>
      </AsideItemWrap>
    </>
  );
};
