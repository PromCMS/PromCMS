import { TableView, TableViewCol } from '@components/TableView';
import { useModelInfo } from '@hooks/useModelInfo';
import { useModelItems } from '@hooks/useModelItems';
import { PageLayout } from '@layouts';
import { ApiResultModel, ItemID } from '@prom-cms/shared';
import { UserPlus } from 'tabler-icons-react';
import { MESSAGES } from '@constants';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatApiModelResultToTableView } from '@utils';
import { Button } from '@mantine/core';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { Page } from '@custom-types';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@api';

const UsersListPage: Page = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const currentUser = useCurrentUser();
  const model = useModelInfo<ApiResultModel>('users');
  const {
    data,
    isLoading,
    isError,
    refetch: mutate,
  } = useModelItems('users', {
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
    () =>
      data?.data ? data.data.filter((user) => user.id !== currentUser?.id) : [],
    [data, currentUser]
  );

  const userCanEdit = currentUser?.can({
    action: 'update',
    targetModel: 'users',
  });

  // Take care of user creation
  const onCreateRequest = () => navigate(`/users/invite`);

  // Take care of edit requests
  const onEditRequest = userCanEdit
    ? (id: ItemID) => navigate(`/users/${id}`)
    : undefined;

  // Take care of delete item request
  const onItemDeleteRequest = userCanEdit
    ? async (id: ItemID) => {
        if (confirm(t(MESSAGES.ON_DELETE_REQUEST_PROMPT))) {
          await apiClient.entries.delete('users', id);
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
    <>
      <PageLayout>
        <div className="flex w-full flex-col justify-between gap-5 py-10 md:flex-row">
          <h1 className="text-3xl font-semibold capitalize">{t('Users')}</h1>
          <div className="flex items-center gap-5">
            {/*<form onSubmit={handleSubmit(console.log)} className="w-full">
              <Input
                placeholder="input..."
                className="w-full"
                prefixIcon={<iconSet.SearchIcon className="rotate-90" />}
                {...register('query')}
              />
            </form>*/}
            <Button
              color="green"
              className=" items-center font-semibold uppercase"
              size="md"
              onClick={onCreateRequest}
            >
              <span className="hidden md:block">{t('Add new user')}</span>
              <UserPlus className="inline-block h-5 w-5 md:ml-3" />{' '}
            </Button>
          </div>
        </div>
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
            page={page}
            onChange={setPage}
          />
        </TableView.Footer>
      </PageLayout>
    </>
  );
};

export default UsersListPage;
