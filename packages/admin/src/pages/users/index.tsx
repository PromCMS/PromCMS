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
import { useTranslation } from 'react-i18next'
import { formatApiModelResultToTableView } from '@utils'
import { useGlobalContext } from '@contexts/GlobalContext'
import { usePagination } from '@mantine/hooks'
import { Button, Pagination } from '@mantine/core'

const UsersListPage: VFC = () => {
  const { push } = useRouter()
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const { currentUser } = useGlobalContext()
  const model = useModelInfo<ApiResultModel>('users')
  const { data, isLoading, isError } = useModelItems('users', {
    page,
  })

  // Models metadata
  const metadata = useMemo(() => {
    if (!data) return false
    const { data: items, ...metadata } = data

    return metadata
  }, [data])

  const filteredUsers = useMemo(
    () =>
      data?.data ? data.data.filter((user) => user.id !== currentUser?.id) : [],
    [data, currentUser]
  )

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
              <iconSet.UserPlus className="inline-block h-5 w-5 md:ml-3" />{' '}
            </Button>
          </div>
        </div>
        <TableView
          isLoading={isLoading || isError}
          items={filteredUsers}
          columns={tableViewColumns || []}
          metadata={metadata || undefined}
          onEditAction={onEditRequest}
          onDeleteAction={onItemDeleteRequest}
          pagination={
            <Pagination
              total={data?.last_page || 1}
              page={page}
              onChange={setPage}
            />
          }
        />
      </PageLayout>
    </>
  )
}

export default UsersListPage
