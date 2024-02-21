import { apiClient } from '@api';
import { TableView, TableViewCol } from '@components/TableView';
import { UnauthorizedPageContent } from '@components/UnauthorizedPageContent';
import { BASE_PROM_ENTITY_TABLE_NAMES, MESSAGES } from '@constants';
import { useAuth } from '@contexts/AuthContext';
import { PageLayout } from '@layouts/PageLayout';
import { Button } from '@mantine/core';
import { createLazyFileRoute } from '@tanstack/react-router';
import { canUser } from '@utils';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useModelItems } from 'hooks/useModelItems';
import { useRequestWithNotifications } from 'hooks/useRequestWithNotifications';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'tabler-icons-react';

import { ItemID } from '@prom-cms/api-client';
import { FieldPlacements } from '@prom-cms/schema';

import { Drawer } from './-components/Drawer';

export const Route = createLazyFileRoute('/_authorized/settings/system/')({
  component: () => {
    const { user } = useAuth();

    if (
      !user ||
      !canUser({
        userRole: user.role,
        action: 'read',
        targetEntityTableName: BASE_PROM_ENTITY_TABLE_NAMES.SETTINGS,
      })
    ) {
      return <UnauthorizedPageContent />;
    }

    return <Page />;
  },
});

const columns: TableViewCol[] = [
  {
    type: 'string',
    admin: {
      editor: { placement: FieldPlacements.MAIN, width: 12 },
      fieldType: 'normal',
      isHidden: false,
    },
    fieldName: 'name',
    hide: false,
    localized: false,
    name: 'jmeno',
    primaryString: false,
    readonly: false,
    required: true,
    title: 'dsafasd',
    unique: false,
  },
];

function Page() {
  const { t } = useTranslation();
  const currentUser = useCurrentUser();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, refetch, isLoading, isError } = useModelItems(
    BASE_PROM_ENTITY_TABLE_NAMES.SETTINGS,
    {
      params: { page: currentPage },
    }
  );
  const [activeOption, setActiveOption] = useState<
    ItemID | 'new' | undefined
  >();
  const reqNotification = useRequestWithNotifications();

  const currentUserCanCreate = currentUser?.can({
    action: 'create',
    targetEntityTableName: BASE_PROM_ENTITY_TABLE_NAMES.SETTINGS,
  });
  const currentUserCanEdit = currentUser?.can({
    action: 'update',
    targetEntityTableName: BASE_PROM_ENTITY_TABLE_NAMES.SETTINGS,
  });
  const currentUserCanDelete = currentUser?.can({
    action: 'delete',
    targetEntityTableName: BASE_PROM_ENTITY_TABLE_NAMES.SETTINGS,
  });

  const onEditClick = useCallback((nextOption: ItemID | undefined) => {
    setActiveOption(nextOption);
  }, []);

  const onDeleteClick = useCallback(
    async (id: ItemID) => {
      if (!confirm(t(MESSAGES.ON_DELETE_REQUEST_PROMPT))) {
        return;
      }

      try {
        reqNotification(
          {
            title: t(MESSAGES.PLEASE_WAIT),
            message: t(MESSAGES.SELECT_OPTION_DELETE_WORKING),
            successMessage: t(MESSAGES.SELECT_OPTION_DELETE_DONE),
          },
          async () => {
            await apiClient.settings.delete(id);
            await refetch();
          }
        );
      } catch {}
    },
    [t, reqNotification, refetch]
  );

  const aside =
    activeOption !== undefined ? (
      <Drawer
        optionToEdit={activeOption === 'new' ? undefined : activeOption}
        onOptionUpdateOrCreate={async () => {
          await refetch();

          setActiveOption(undefined);
        }}
      />
    ) : null;

  return (
    <PageLayout rightAsideOutlet={aside} rightAsideClassName="w-[500px]">
      <PageLayout.Header>
        {currentUserCanCreate ||
        (!!currentUserCanEdit && activeOption !== undefined) ? (
          <Button
            color={activeOption !== undefined ? 'red' : 'green'}
            leftSection={activeOption !== undefined ? <X /> : <Plus />}
            onClick={() =>
              setActiveOption(activeOption !== undefined ? undefined : 'new')
            }
            className="block mb-3 ml-auto"
          >
            {t(activeOption !== undefined ? 'Close' : 'Add new')}
          </Button>
        ) : null}
      </PageLayout.Header>
      <PageLayout.Content>
        <TableView
          isLoading={isLoading || isError}
          items={data?.data ?? []}
          onDeleteAction={currentUserCanDelete ? onDeleteClick : undefined}
          onEditAction={currentUserCanEdit ? onEditClick : undefined}
          columns={columns}
        />
      </PageLayout.Content>
    </PageLayout>
  );
}
