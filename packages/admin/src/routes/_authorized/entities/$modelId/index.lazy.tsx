import { apiClient } from '@api';
import { TableView, TableViewCol, TableViewProps } from '@components/TableView';
import { formatApiModelResultToTableView } from '@components/TableView/_utils';
import { MESSAGES, pageUrls } from '@constants';
import { PageLayout } from '@layouts/PageLayout';
import { Button } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { modelIsCustom } from '@utils';
import useCurrentModel from 'hooks/useCurrentModel';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useModelItems } from 'hooks/useModelItems';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'tabler-icons-react';

import { ItemID, ResultItem } from '@prom-cms/api-client';

export const Route = createLazyFileRoute('/_authorized/entities/$modelId/')({
  component: EntityMainPage,
});

function EntityMainPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const model = useCurrentModel();
  const currentUser = useCurrentUser();
  const [apiWorking, setApiWorking] = useState(false);
  const {
    data,
    isLoading,
    isError,
    refetch: mutate,
  } = useModelItems(model?.name, {
    params: {
      page: page,
      limit: pageSize,
      ...(model?.timestamp ? { 'orderBy.created_at': 'desc' } : {}),
    },
  });
  const { t } = useTranslation();
  const [listItems, handlers] = useListState<ResultItem>(data?.data);

  useEffect(() => {
    if (data?.data) {
      handlers.setState(data?.data);
    }
  }, [data]);

  // metadata from model items/entries
  const metadata = useMemo(() => {
    if (!data) return false;
    const { data: items, ...metadata } = data;

    return metadata;
  }, [data]);

  const onDragEnd: TableViewProps['onDragEnd'] = async ({
    source,
    destination,
  }) => {
    if (destination?.index === undefined) return;

    setApiWorking(true);

    const fromId = listItems[source.index].id;
    const toId = listItems[destination.index].id;

    if (fromId !== toId) {
      handlers.reorder({ from: source.index, to: destination.index });
      await apiClient.entries.for(model!.name).swap({
        fromId,
        toId,
      });
    }

    setApiWorking(false);
  };

  // format model result from api to table
  const tableViewColumns = useMemo<TableViewCol[] | undefined>(() => {
    if (!model) return;

    return formatApiModelResultToTableView(model as any);
  }, [model]);

  // take care of action if user requests entry delete
  const onItemDeleteRequest =
    model &&
    currentUser?.can({
      action: 'delete',
      targetEntityTableName: model?.name,
    })
      ? async (id: ItemID) => {
          if (confirm(t(MESSAGES.ON_DELETE_REQUEST_PROMPT))) {
            await apiClient.entries.for(model.name).delete(id);
            mutate();
          }
        }
      : undefined;

  const onItemDuplicateRequest =
    model &&
    currentUser?.can({
      action: 'create',
      targetEntityTableName: model?.name,
    })
      ? async (id: ItemID) => {
          if (confirm(t(MESSAGES.ENTRY_ITEM_DUPLICATE))) {
            navigate({
              to: pageUrls.entryTypes(model?.name as string).duplicate(id),
            });
          }
        }
      : undefined;

  const onCreateRequest = () =>
    navigate({ to: pageUrls.entryTypes(model?.name as string).create });

  const onEditRequest = (id: ItemID) =>
    navigate({ to: pageUrls.entryTypes(model?.name as string).view(id) });

  // This resets a pager to start, because this page component maintains internal state across pages
  useEffect(() => setPage(1), [model]);

  // TODO: Show better 404 page
  if (!model || !tableViewColumns || modelIsCustom(model.name))
    throw new Error('not found');

  return (
    <PageLayout>
      <PageLayout.Header title={t(model.title ?? model.name)}>
        <div className="flex items-center gap-5">
          {/*<form onSubmit={handleSubmit(console.log)} className="w-full">
            <Input
              placeholder="input..."
              className="w-full"
              prefixIcon={<iconSet.SearchIcon className="rotate-90" />}
              {...register('query')}
            />
  </form>*/}
          {currentUser?.can({
            action: 'create',
            targetEntityTableName: model.name,
          }) && (
            <Button
              color="green"
              className=" items-center font-semibold uppercase"
              size="md"
              onClick={onCreateRequest}
            >
              <span className="hidden md:block">{t('Add new entry')}</span>
              <Plus className="inline-block h-5 w-5 md:ml-3" />{' '}
            </Button>
          )}
        </div>
      </PageLayout.Header>

      <PageLayout.Content>
        <TableView
          isLoading={isLoading || isError}
          items={listItems}
          columns={tableViewColumns}
          onEditAction={onEditRequest}
          onDeleteAction={onItemDeleteRequest}
          onDuplicateAction={onItemDuplicateRequest}
          ordering={!!model.sorting}
          onDragEnd={onDragEnd}
          disabled={apiWorking}
        />
        <TableView.Footer>
          <TableView.PageSizeSelect
            value={String(pageSize)}
            onChange={(val) => {
              setPageSize(val ? Number(val) : 20);
            }}
          />
          {metadata && (
            <TableView.Metadata className="mr-auto ml-5" {...metadata} />
          )}
          <TableView.Pagination
            className="ml-auto"
            total={data?.last_page || 1}
            page={page}
            onChange={setPage}
          />
        </TableView.Footer>
      </PageLayout.Content>
    </PageLayout>
  );
}
