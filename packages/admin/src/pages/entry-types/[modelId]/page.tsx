import { PageLayout } from '@layouts';
import { useEffect, useMemo, useState } from 'react';
import { TableView, TableViewCol, TableViewProps } from '@components/TableView';
import { useModelItems } from '@hooks/useModelItems';
import useCurrentModel from '@hooks/useCurrentModel';
import { formatApiModelResultToTableView, modelIsCustom } from '@utils';
import { ItemID } from '@prom-cms/shared';
import { MESSAGES, pageUrls } from '@constants';
import NotFoundPage from '@pages/404';
import { useTranslation } from 'react-i18next';
import { Button } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { Plus } from 'tabler-icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Page } from '@custom-types';
import { ResultItem } from '@prom-cms/api-client';
import { apiClient } from '@api';

const EntryTypeUnderpage: Page = ({}) => {
  const navigate = useNavigate();
  const { modelId: routerModelId } = useParams();
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
      ...(model?.hasTimestamps ? { 'orderBy.created_at': 'desc' } : {}),
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
      await apiClient.entries.swap(model!.name, {
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
      targetModel: model?.name,
    })
      ? async (id: ItemID) => {
          if (confirm(t(MESSAGES.ON_DELETE_REQUEST_PROMPT))) {
            await apiClient.entries.delete(model.name, id);
            mutate();
          }
        }
      : undefined;

  const onItemDuplicateRequest =
    model &&
    currentUser?.can({
      action: 'create',
      targetModel: model?.name,
    })
      ? async (id: ItemID) => {
          if (confirm(t(MESSAGES.ENTRY_ITEM_DUPLICATE))) {
            navigate(pageUrls.entryTypes(model?.name as string).duplicate(id));
          }
        }
      : undefined;

  const onCreateRequest = () =>
    navigate(pageUrls.entryTypes(model?.name as string).create);

  const onEditRequest = (id: ItemID) =>
    navigate(pageUrls.entryTypes(model?.name as string).view(id));

  // This resets a pager to start, because this page component maintains internal state across pages
  useEffect(() => setPage(1), [routerModelId]);

  // TODO: Show better 404 page
  if (!model || !tableViewColumns || modelIsCustom(model.name))
    return <NotFoundPage text={t('This model with this id does not exist.')} />;

  return (
    <PageLayout>
      <div className="flex w-full flex-col justify-between gap-5 py-10 md:flex-row">
        <h1 className="text-3xl font-semibold capitalize">
          {t(model.title ?? model.name)}
        </h1>
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
            targetModel: model.name,
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
      </div>
      <TableView
        isLoading={isLoading || isError}
        items={listItems}
        columns={tableViewColumns}
        onEditAction={onEditRequest}
        onDeleteAction={onItemDeleteRequest}
        onDuplicateAction={onItemDuplicateRequest}
        ordering={!!model.hasOrdering}
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
    </PageLayout>
  );
};

export default EntryTypeUnderpage;
