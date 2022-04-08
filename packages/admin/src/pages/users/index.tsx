import { Button } from '@components/Button'
import Input from '@components/form/Input'
import { TableView, TableViewCol } from '@components/TableView'
import { useModelInfo } from '@hooks/useModelInfo'
import { useModelItems } from '@hooks/useModelItems'
import { PageLayout } from '@layouts'
import { ApiResultModel, ItemID } from '@prom-cms/shared'
import { iconSet } from '@prom-cms/icons'
import { MESSAGES } from '@constants'
import { EntryService } from '@services'
import { useRouter } from 'next/router'
import { useMemo, useState, VFC } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { formatApiModelResultToTableView } from '@utils'

const UsersListPage: VFC = () => {
  const { push } = useRouter()
  const { t } = useTranslation()
  const model = useModelInfo<ApiResultModel>('users')
  const { register, handleSubmit } = useForm()
  const [currentPage, setCurrentPage] = useState(1)
  const { data, isLoading, isError } = useModelItems('users', {
    page: currentPage,
  })

  // Models metadata
  const metadata = useMemo(() => {
    if (!data) return false
    const { data: items, ...metadata } = data

    return metadata
  }, [data])

  // Take care of user creation
  const onCreateRequest = () => push(`/users/create`)

  // Take care of edit requests
  const onEditRequest = (id: ItemID) => push(`/users/${id}`)

  //
  const onItemDeleteRequest = (id: ItemID) => {
    if (confirm(t(MESSAGES.ON_DELETE_REQUEST_PROMPT))) {
      EntryService.delete({ id, model: 'users' })
    }
  }

  // Take care of pagination
  const onPaginateClick = (direction: 'next' | 'prev') => () =>
    setCurrentPage(direction === 'next' ? currentPage + 1 : currentPage - 1)

  // Table columns need to be formated
  const tableViewColumns = useMemo<TableViewCol[] | undefined>(() => {
    if (!model) return

    return formatApiModelResultToTableView(model)
  }, [model])

  return (
    <>
      <PageLayout>
        <div className="flex w-full flex-col justify-between gap-5 py-10 md:flex-row">
          <h1 className="text-3xl font-semibold capitalize">{t('Users')}</h1>
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
              <span className="hidden md:block">{t('Add new user')}</span>
              <iconSet.UserAddIcon className="inline-block h-5 w-5 md:ml-3" />{' '}
            </Button>
          </div>
        </div>
        <TableView
          isLoading={isLoading || isError}
          items={data?.data || []}
          columns={tableViewColumns || []}
          metadata={metadata || undefined}
          onNextPage={onPaginateClick('next')}
          onPrevPage={onPaginateClick('prev')}
          onEditAction={onEditRequest}
          onDeleteAction={onItemDeleteRequest}
        />
      </PageLayout>
    </>
  )
}

export default UsersListPage
