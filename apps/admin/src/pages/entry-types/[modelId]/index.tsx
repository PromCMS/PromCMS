import { PageLayout } from '@layouts';
import { useEffect, useMemo, useState, VFC } from 'react';
import { TableView, TableViewCol, TableViewProps } from '@components/TableView';
import { useModelItems } from '@hooks/useModelItems';
import useCurrentModel from '@hooks/useCurrentModel';
import { formatApiModelResultToTableView, modelIsCustom } from '@utils';
import { ApiResultItem, ItemID } from '@prom-cms/shared';
import { useRouter } from 'next/router';
import { EntryService } from '@services';
import { MESSAGES } from '@constants';
import NotFoundPage from '@pages/404';
import { useTranslation } from 'react-i18next';
import { Button, Pagination } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { Plus } from 'tabler-icons-react';

const EntryTypeUnderpage: VFC = ({}) => {
  const { push } = useRouter();
  const [page, setPage] = useState(1);
  const model = useCurrentModel();
  const currentUser = useCurrentUser();
  const [apiWorking, setApiWorking] = useState(false);
  const {
    query: { modelId: routerModelId },
  } = useRouter();
  const { data, isLoading, isError, mutate } = useModelItems(model?.name, {
    page: page,
  });
  const { t } = useTranslation();
  const [listItems, handlers] = useListState<ApiResultItem>(data?.data);

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

    handlers.reorder({ from: source.index, to: destination.index });

    await EntryService.reorder(model!.name, {
      fromId,
      toId,
    });

    setApiWorking(false);
  };

  // format model result from api to table
  const tableViewColumns = useMemo<TableViewCol[] | undefined>(() => {
    if (!model) return;

    return formatApiModelResultToTableView(model);
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
            await EntryService.delete({ id, model: model?.name as string });
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
            push(EntryService.getDuplicateUrl(id, model?.name as string));
          }
        }
      : undefined;

  const onCreateRequest = () =>
    push(EntryService.getCreateUrl(model?.name as string));

  const onEditRequest = (id: ItemID) =>
    push(EntryService.getUrl(id, model?.name as string));

  // This resets a pager to start, because this page component maintains internal state across pages
  useEffect(() => setPage(1), [routerModelId]);

  // TODO: Show better 404 page
  if (!model || !tableViewColumns || modelIsCustom(model.name))
    return <NotFoundPage text={t('This model with this id does not exist.')} />;

  return (
    <PageLayout>
      <div className="flex w-full flex-col justify-between gap-5 py-10 md:flex-row">
        <h1 className="text-3xl font-semibold capitalize">{t(model.name)}</h1>
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
        metadata={metadata || undefined}
        onEditAction={onEditRequest}
        onDeleteAction={onItemDeleteRequest}
        onDuplicateAction={onItemDuplicateRequest}
        ordering={model.hasOrdering}
        onDragEnd={onDragEnd}
        disabled={apiWorking}
        pagination={
          <Pagination
            total={data?.last_page || 1}
            page={page}
            onChange={setPage}
          />
        }
      />
    </PageLayout>
  );
};

export default EntryTypeUnderpage;
