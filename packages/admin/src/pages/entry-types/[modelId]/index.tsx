import { iconSet } from '@prom-cms/icons'
import { PageLayout } from '@layouts'
import { useEffect, useMemo, useState, VFC } from 'react'
import { TableView, TableViewCol } from '@components/TableView'
import { Button } from '@components/Button'
import Input from '@components/form/Input'
import { useForm } from 'react-hook-form'
import { useModelItems } from '@hooks/useModelItems'
import useCurrentModel from '@hooks/useCurrentModel'
import { formatApiModelResultToTableView, modelIsCustom } from '@utils'
import { ItemID } from '@prom-cms/shared'
import { useRouter } from 'next/router'
import { EntryService } from '@services'
import { MESSAGES } from '@constants'
import NotFoundPage from '@pages/404'
import { useTranslation } from 'react-i18next'

const EntryTypeUnderpage: VFC = ({}) => {
  const { push } = useRouter()
  const { register, handleSubmit } = useForm()
  const [currentPage, setCurrentPage] = useState(1)
  const model = useCurrentModel()
  const {
    query: { modelId: routerModelId },
  } = useRouter()
  const { data, isLoading, isError } = useModelItems(model?.name, {
    page: currentPage,
  })
  const { t } = useTranslation()

  // metadata from model items/entries
  const metadata = useMemo(() => {
    if (!data) return false
    const { data: items, ...metadata } = data

    return metadata
  }, [data])

  // format model result from api to table
  const tableViewColumns = useMemo<TableViewCol[] | undefined>(() => {
    if (!model) return

    return formatApiModelResultToTableView(model)
  }, [model])

  // take care of action if user requests entry edit

  // take care of action if user requests entry delete
  const onItemDeleteRequest = (id: ItemID) => {
    if (confirm(t(MESSAGES.ON_DELETE_REQUEST_PROMPT))) {
      EntryService.delete({ id, model: model?.name as string })
    }
  }
  const onCreateRequest = () =>
    push(EntryService.getCreateUrl(model?.name as string))

  const onEditRequest = (id: ItemID) =>
    push(EntryService.getUrl(id, model?.name as string))

  // This resets a pager to start, because this page component maintains internal state across pages
  useEffect(() => setCurrentPage(1), [routerModelId])

  // TODO: Show better 404 page
  if (!model || !tableViewColumns || modelIsCustom(model.name))
    return <NotFoundPage text={t('This model with this id does not exist.')} />

  const onPaginateClick = (direction: 'next' | 'prev') => () =>
    setCurrentPage(direction === 'next' ? currentPage + 1 : currentPage - 1)

  return (
    <PageLayout>
      <div className="flex w-full flex-col justify-between gap-5 py-10 md:flex-row">
        <h1 className="text-3xl font-semibold capitalize">{t(model.name)}</h1>
        <div className="flex gap-5">
          <form onSubmit={handleSubmit(console.log)} className="w-full">
            <Input
              placeholder="input..."
              className="w-full"
              prefixIcon={<iconSet.SearchIcon className="rotate-90" />}
              {...register('query')}
            />
          </form>
          <Button
            color="success"
            className="flex flex-none items-center font-semibold uppercase"
            onClick={onCreateRequest}
          >
            <span className="hidden md:block">{t('Add new entry')}</span>
            <iconSet.PlusIcon className="inline-block h-5 w-5 md:ml-3" />{' '}
          </Button>
        </div>
      </div>
      <TableView
        isLoading={isLoading || isError}
        items={data?.data || []}
        columns={tableViewColumns}
        metadata={metadata || undefined}
        onNextPage={onPaginateClick('next')}
        onPrevPage={onPaginateClick('prev')}
        onEditAction={onEditRequest}
        onDeleteAction={onItemDeleteRequest}
      />
    </PageLayout>
  )
}

export default EntryTypeUnderpage
