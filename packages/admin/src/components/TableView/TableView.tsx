import ItemsMissingMessage from '@components/ItemsMissingMessage'
import Skeleton, { SkeltonProps } from '@components/Skeleton'
import { ItemID, PagedResult } from '@prom-cms/shared'
import { iconSet } from '@prom-cms/icons'
import clsx from 'clsx'
import { useCallback, useMemo, VFC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { createIterativeArray } from '@utils'
import { ActionIcon, Group, Pagination } from '@mantine/core'
import { ReactNode } from 'react'

export type TableViewItem = { id: string | number; [x: string]: any }

export type TableViewCol = {
  title: string
  fieldName: string
  show?: boolean
  formatter?: <T extends TableViewItem>(
    data: T,
    columnInfo: Omit<TableViewCol, 'formatter'>
  ) => any
}

export interface TableViewProps {
  columns: TableViewCol[]
  items: Array<TableViewItem>
  isLoading?: boolean
  metadata?: Omit<PagedResult<any>, 'data'>
  pagination?: ReactNode
  onDeleteAction?: (id: ItemID) => void
  onEditAction?: (id: ItemID) => void
}

const TableSkeleton: VFC<SkeltonProps> = ({ className, ...rest }) => (
  <Skeleton className={clsx(className, 'h-7 w-full')} {...rest} />
)

const iterativeSkeletonArray = createIterativeArray(5)

const TableView: VFC<TableViewProps> = ({
  columns,
  items,
  metadata,
  isLoading,
  pagination,
  onDeleteAction,
  onEditAction,
}) => {
  const { t } = useTranslation()

  const onActionClick = useCallback(
    (actionType: 'delete' | 'edit', id: ItemID) => () => {
      if (actionType === 'delete' && onDeleteAction) onDeleteAction(id)
      else if (actionType === 'edit' && onEditAction) onEditAction(id)
    },
    [onEditAction, onDeleteAction]
  )

  const filteredCols = useMemo(() => {
    return columns.filter(({ show }) => show === undefined || show)
  }, [columns])

  const hasActions = onEditAction || onDeleteAction

  return (
    <>
      <div className="inline-block w-full min-w-full overflow-hidden overflow-x-auto rounded-prom border-2 border-project-border bg-white px-7">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              {filteredCols.map(({ fieldName, title, show }) => (
                <th
                  key={fieldName}
                  className="border-b-2 border-gray-100 px-5 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                >
                  {t(title)}
                </th>
              ))}
              {hasActions && (
                <th className="w-[100px] border-b-2 border-gray-100 px-5 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 text-opacity-0">
                  {t('Actions')}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {items.length && !isLoading ? (
              items.map((itemData) => (
                <tr key={itemData.id} className="group">
                  {filteredCols.map(({ formatter, title, fieldName }) => (
                    <td
                      key={fieldName}
                      className="border-b border-gray-200 bg-white px-5 py-5 text-sm group-last:border-opacity-0"
                    >
                      {formatter ? (
                        formatter(itemData, { title, fieldName })
                      ) : (
                        <p
                          className="w-full max-w-[350px] overflow-hidden truncate text-gray-900"
                          title={itemData[fieldName]}
                        >
                          {itemData[fieldName]}
                        </p>
                      )}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="w-[100px] justify-end border-b border-gray-200 bg-white px-5 py-5 group-last:border-opacity-0">
                      <Group spacing="sm" noWrap>
                        {onEditAction && (
                          <ActionIcon
                            onClick={onActionClick('edit', itemData.id)}
                            title={t('Edit')}
                            color={'blue'}
                          >
                            <iconSet.Pencil className="w-5" />{' '}
                          </ActionIcon>
                        )}
                        {onDeleteAction && (
                          <ActionIcon
                            onClick={onActionClick('delete', itemData.id)}
                            title={t('Delete')}
                            color={'red'}
                          >
                            <iconSet.Trash className="w-5" />{' '}
                          </ActionIcon>
                        )}
                      </Group>
                    </td>
                  )}
                </tr>
              ))
            ) : !isLoading ? (
              <tr>
                <td colSpan={filteredCols.length + (hasActions ? 1 : 0)}>
                  <ItemsMissingMessage />
                </td>
              </tr>
            ) : (
              iterativeSkeletonArray.map((index) => (
                <tr key={index}>
                  {filteredCols.map(({ fieldName }) => (
                    <td key={fieldName} className="py-3 px-5">
                      <TableSkeleton />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {metadata && (
        <>
          <div className="xs:justify-between mt-2 flex items-center justify-between">
            <div className="xs:text-sm text-xs text-gray-900">
              <Trans
                i18nKey={'Showing {{from}} to {{to}} of {{total}} entries'}
                from={metadata.from}
                to={metadata.to}
                total={metadata.total}
              >
                Showing {{ from: metadata.from }} to {{ to: metadata.to }} of{' '}
                {{ total: metadata.total }} entries
              </Trans>
            </div>
            <div className="inline-flex gap-2 text-gray-500">{pagination}</div>
          </div>
        </>
      )}
    </>
  )
}

export default TableView
