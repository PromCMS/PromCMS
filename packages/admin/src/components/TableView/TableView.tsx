import ItemsMissingMessage from '@components/ItemsMissingMessage';
import Skeleton, { SkeltonProps } from '@components/Skeleton';
import { ItemID } from '@prom-cms/shared';
import clsx from 'clsx';
import {
  PropsWithChildren,
  useCallback,
  useMemo,
  FC,
  DetailedHTMLProps,
  HTMLAttributes,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { createIterativeArray } from '@utils';
import {
  ActionIcon,
  Group,
  Pagination,
  Paper,
  Select,
  SelectItem,
} from '@mantine/core';
import {
  DragDropContext,
  DragDropContextProps,
  Draggable,
  Droppable,
} from 'react-beautiful-dnd';
import { useClassNames } from './useClassNames';
import { useState } from 'react';
import { Copy, GripVertical, Pencil, Trash } from 'tabler-icons-react';
import { PagedResponse } from '@prom-cms/api-client';
import { SelectProps } from '@mantine/core/lib/Select/Select';
import { MESSAGES } from '@constants';

export type TableViewItem = { id: string | number; [x: string]: any };

export type TableViewCol = {
  title: string;
  fieldName: string;
  show?: boolean;
  formatter?: <T extends TableViewItem>(
    data: T,
    columnInfo: Omit<TableViewCol, 'formatter'>
  ) => any;
};

export interface TableViewProps {
  columns: TableViewCol[];
  items: Array<TableViewItem>;
  isLoading?: boolean;
  onDeleteAction?: (id: ItemID) => void;
  onEditAction?: (id: ItemID) => void;
  onDuplicateAction?: (id: ItemID) => void;
  ordering?: boolean;
  onDragEnd?: DragDropContextProps['onDragEnd'];
  disabled?: boolean;
  pageSizes?: number[];
}

const TableSkeleton: FC<SkeltonProps> = ({ className, ...rest }) => (
  <Skeleton className={clsx(className, 'h-7 w-full')} {...rest} />
);

const iterativeSkeletonArray = createIterativeArray(5);

const DynamicDraggable: FC<
  PropsWithChildren<{ index: number; id: ItemID; toggled: boolean }>
> = ({ children, index, id, toggled }) => {
  const classNames = useClassNames();

  if (!toggled) {
    return <tr className={classNames.tableRow}>{children}</tr>;
  }

  return (
    // @ts-ignore
    <Draggable index={index} draggableId={String(id)}>
      {(provided, snapshot) => (
        <tr
          className={clsx(classNames.tableRow, snapshot.isDragging && 'table')}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <td style={{ width: 40 }}>
            <div {...provided.dragHandleProps}>
              <GripVertical size={18} />
            </div>
          </td>
          {children}
        </tr>
      )}
    </Draggable>
  );
};

type ActionType = 'delete' | 'edit' | 'duplicate';

const TableView: FC<TableViewProps> & {
  Footer: typeof Footer;
  Metadata: typeof Metadata;
  Pagination: typeof Pagination;
  PageSizeSelect: typeof PageSizeSelect;
} = ({
  columns,
  items,
  isLoading,
  onDeleteAction,
  onEditAction,
  onDuplicateAction,
  onDragEnd = () => {},
  ordering,
  disabled,
}) => {
  const { t } = useTranslation();
  const classNames = useClassNames();
  const [activeActions, setActiveActions] =
    useState<Record<string, { id: ItemID; type: ActionType }>>();

  const onActionClick = useCallback(
    (actionType: ActionType, id: ItemID) => async () => {
      let actionFunction;

      if (actionType === 'delete' && onDeleteAction)
        actionFunction = onDeleteAction;
      else if (actionType === 'edit' && onEditAction)
        actionFunction = onEditAction;
      else if (actionType === 'duplicate' && onDuplicateAction)
        actionFunction = onDuplicateAction;

      if (actionFunction.then) {
        // TODO: indicate which action on which item is working
        await actionFunction(id);
      } else {
        actionFunction(id);
      }
    },
    [onEditAction, onDeleteAction, onDuplicateAction]
  );

  const filteredCols = useMemo(() => {
    return columns.filter(({ show }) => show === undefined || show);
  }, [columns]);

  const hasActions = onEditAction || onDeleteAction;
  const normalCellsWidth = useMemo(() => {
    const normalCellsCount = filteredCols.filter(
      ({ fieldName }) => fieldName !== 'id'
    ).length;

    return `calc(${100 / normalCellsCount}% - ${
      ((ordering ? 100 : 0) + (hasActions ? 150 : 0)) / normalCellsCount
    }px)`;
  }, [filteredCols, hasActions, ordering]);

  return (
    <>
      {/* @ts-ignore */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Paper withBorder shadow="sm" className={classNames.tableWrapper}>
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                {ordering && <th style={{ width: 40 }} />}
                {filteredCols.map(({ fieldName, title }) => (
                  <th
                    key={fieldName}
                    style={{
                      width: fieldName === 'id' ? 100 : normalCellsWidth,
                    }}
                    className={classNames.tableHead}
                  >
                    {t(title)}
                  </th>
                ))}
                {hasActions && (
                  <th
                    style={{ width: 150 }}
                    className={clsx(classNames.tableHead, 'text-opacity-0')}
                  >
                    {t('Actions')}
                  </th>
                )}
              </tr>
            </thead>
            {/* @ts-ignore */}
            <Droppable
              droppableId="dnd-table-view"
              direction="vertical"
              isDropDisabled={!ordering}
            >
              {(provided) => (
                // @ts-ignore
                <tbody {...provided.droppableProps} ref={provided.innerRef}>
                  {/* Items  */}
                  {!!items.length &&
                    !isLoading &&
                    items.map((itemData, index) => (
                      // @ts-ignore
                      <DynamicDraggable
                        key={itemData.id}
                        index={index}
                        id={itemData.id}
                        toggled={!!ordering}
                      >
                        {filteredCols.map(({ formatter, title, fieldName }) => (
                          <td
                            style={{
                              width:
                                fieldName === 'id' ? 100 : normalCellsWidth,
                            }}
                            key={fieldName}
                            className={classNames.tableData}
                          >
                            {formatter ? (
                              formatter(itemData, { title, fieldName })
                            ) : (
                              <p
                                className={classNames.tableDataParagraph}
                                title={itemData[fieldName]}
                              >
                                {itemData[fieldName]}
                              </p>
                            )}
                          </td>
                        ))}
                        {hasActions && (
                          <td
                            style={{ width: 150 }}
                            className={classNames.tableData}
                          >
                            <Group spacing={5} position="right" noWrap>
                              {onDuplicateAction && (
                                <ActionIcon
                                  onClick={onActionClick(
                                    'duplicate',
                                    itemData.id
                                  )}
                                  title={t('Duplicate')}
                                  color={'blue'}
                                >
                                  <Copy className="w-5" />{' '}
                                </ActionIcon>
                              )}
                              {onEditAction && (
                                <ActionIcon
                                  onClick={onActionClick('edit', itemData.id)}
                                  title={t('Edit')}
                                  color={'blue'}
                                >
                                  <Pencil className="w-5" />{' '}
                                </ActionIcon>
                              )}
                              {onDeleteAction && (
                                <ActionIcon
                                  onClick={onActionClick('delete', itemData.id)}
                                  title={t('Delete')}
                                  color={'red'}
                                >
                                  <Trash className="w-5" />{' '}
                                </ActionIcon>
                              )}
                            </Group>
                          </td>
                        )}
                      </DynamicDraggable>
                    ))}

                  {/* Items missing placeholders */}
                  {!items.length && !isLoading && (
                    <tr>
                      <td
                        colSpan={
                          filteredCols.length +
                          (hasActions ? 1 : 0) +
                          (ordering ? 1 : 0)
                        }
                      >
                        <ItemsMissingMessage />
                      </td>
                    </tr>
                  )}

                  {/* Loading placeholders */}
                  {isLoading &&
                    iterativeSkeletonArray.map((index) => (
                      <tr key={index}>
                        {(
                          [
                            ordering && { fieldName: 'ordering_drag' },
                            ...filteredCols,
                          ].filter((field) => !!field) as (
                            | TableViewCol
                            | { fieldName: string }
                          )[]
                        ).map(({ fieldName }) => (
                          <td key={fieldName} className="py-3 px-5">
                            <TableSkeleton />
                          </td>
                        ))}
                      </tr>
                    ))}

                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </table>
          {disabled && (
            <div className="absolute inset-0 bg-gray-100 opacity-70" />
          )}
        </Paper>
      </DragDropContext>
    </>
  );
};

const Footer: FC<PropsWithChildren> = ({ children }) => (
  <>
    <div className="xs:justify-between mt-2 flex items-center justify-between">
      {children}
    </div>
  </>
);

const Metadata: FC<
  Omit<PagedResponse<any>, 'data'> &
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ from, to, total, className, ...rest }) => (
  <div
    className={clsx('xs:text-sm text-xs text-gray-900', className)}
    {...rest}
  >
    <Trans
      i18nKey={MESSAGES.PAGINATION_CONTENT}
      from={from}
      to={to}
      total={total}
    >
      Showing {{ from: from }} to {{ to: to }} of {{ total: total }} entries
    </Trans>
  </div>
);

const PageSizeSelect: FC<
  {
    options?: number[];
    onChange: SelectProps['onChange'];
    value: string;
  } & Omit<SelectProps, 'options' | 'onChange' | 'value' | 'data'>
> = ({
  onChange,
  value,
  options = [
    DEFAULT_TABLE_PAGE_SIZE,
    DEFAULT_TABLE_PAGE_SIZE * 2,
    DEFAULT_TABLE_PAGE_SIZE * 3,
    DEFAULT_TABLE_PAGE_SIZE * 4,
  ],
  ...rest
}) => {
  const { t } = useTranslation();

  const data = useMemo(() => {
    const label = t('items');

    return options.map<SelectItem>((value) => ({
      value: String(value),
      label: `${value} ${label}`,
    }));
  }, [options]);

  return <Select data={data} value={value} onChange={onChange} {...rest} />;
};

TableView.Metadata = Metadata;
TableView.Footer = Footer;
TableView.Pagination = Pagination;
TableView.PageSizeSelect = PageSizeSelect;

export const DEFAULT_TABLE_PAGE_SIZE = 20;

export default TableView;
