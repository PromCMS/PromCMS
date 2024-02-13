import { apiClient } from '@api';
import { TableView, TableViewCol } from '@components/TableView';
import { formatApiModelResultToTableView } from '@components/TableView/_utils';
import { BASE_PROM_ENTITY_TABLE_NAMES, MESSAGES } from '@constants';
import { useAuth } from '@contexts/AuthContext';
import { useModelInfo } from '@hooks/useModelInfo';
import { useModelItems } from '@hooks/useModelItems';
import { PageLayout } from '@layouts/PageLayout';
import { ActionIcon, Button } from '@mantine/core';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { canUser } from '@utils';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, UserPlus } from 'tabler-icons-react';

import { ApiResultModel, ItemID } from '@prom-cms/api-client';

export const Route = createLazyFileRoute('/_authorized/users/')({
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const model = useModelInfo<ApiResultModel>(
    BASE_PROM_ENTITY_TABLE_NAMES.USERS
  );
  const {
    data,
    isLoading,
    isError,
    refetch: mutate,
  } = useModelItems(BASE_PROM_ENTITY_TABLE_NAMES.USERS, {
    params: {
      page,
    },
  });

  // Models metadata
  const metadata = useMemo(() => {
    if (!data) return false;
    const { data: items, ...metadata } = data;

    return metadata;
  }, [data]);

  const filteredUsers = useMemo(
    () => (data?.data ? data.data.filter((user) => user.id !== user?.id) : []),
    [data, user]
  );

  const userCanEdit = canUser({
    userRole: user!.role,
    action: 'update',
    targetEntityTableName: BASE_PROM_ENTITY_TABLE_NAMES.USERS,
  });

  // Take care of user creation
  const onCreateRequest = () => navigate({ to: `/users/create` });

  // Take care of edit requests
  const onEditRequest = userCanEdit
    ? (id: ItemID) => navigate({ to: `/users/${id}` })
    : undefined;

  // Take care of delete item request
  const onItemDeleteRequest = userCanEdit
    ? async (id: ItemID) => {
        if (confirm(t(MESSAGES.ON_DELETE_REQUEST_PROMPT))) {
          await apiClient.users.delete(id);
          mutate();
        }
      }
    : undefined;

  // Table columns need to be formated
  const tableViewColumns = useMemo<TableViewCol[] | undefined>(() => {
    if (!model) return;

    return formatApiModelResultToTableView(model as any);
  }, [model]);

  return (
    <PageLayout>
      <PageLayout.Header
        title={t('Users')}
        classNames={{ wrapper: 'flex items-center justify-between' }}
      >
        {user?.role &&
          canUser({
            userRole: user?.role,
            action: 'create',
            targetEntityTableName: model.tableName,
          }) && (
            <>
              <Button
                color="green"
                className="font-semibold uppercase hidden md:block"
                size="md"
                onClick={onCreateRequest}
                leftSection={<Plus className="inline-block h-5 w-5" />}
              >
                <span className="hidden md:block">{t('Add new user')}</span>
              </Button>

              <ActionIcon
                color="green"
                className=" block md:hidden"
                size="xl"
                onClick={onCreateRequest}
              >
                <Plus className="inline-block h-7 w-7" />
              </ActionIcon>
            </>
          )}
      </PageLayout.Header>
      <PageLayout.Content>
        <TableView
          isLoading={isLoading || isError}
          items={filteredUsers}
          columns={tableViewColumns || []}
          onEditAction={onEditRequest}
          onDeleteAction={onItemDeleteRequest}
        />
        <TableView.Footer>
          {metadata && <TableView.Metadata {...metadata} />}
          <TableView.Pagination
            className="ml-auto"
            total={data?.last_page || 1}
            value={page}
            onChange={setPage}
          />
        </TableView.Footer>
      </PageLayout.Content>
    </PageLayout>
  );
}
