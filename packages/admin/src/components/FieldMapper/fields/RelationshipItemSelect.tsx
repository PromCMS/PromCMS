import ItemsMissingMessage from '@components/ItemsMissingMessage';
import { MESSAGES, pageUrls } from '@constants';
import { EntityLink } from '@custom-types';
import { useModelItems } from '@hooks/useModelItems';
import {
  Button,
  Checkbox,
  ComboboxItem,
  Drawer,
  Input,
  Pagination,
  Paper,
  Select,
  Skeleton,
  Table,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import Mustache from 'mustache';
import { Suspense, useMemo, useState } from 'react';
import { FC } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'tabler-icons-react';

import { ColumnTypeRelationship } from '@prom-cms/schema';

export interface RelationshipItemSelectProps
  extends Omit<ColumnTypeRelationship, 'title'> {
  columnName: string;
  error: string;
  disabled?: boolean;
  title?: string;
}

const MultipleDisplay: FC<{
  values: EntityLink<any>[];
  targetModelTableName: ColumnTypeRelationship['targetModelTableName'];
  labelConstructor: ColumnTypeRelationship['labelConstructor'];
}> = ({ values, targetModelTableName, labelConstructor }) => {
  const { data } = useModelItems(targetModelTableName, {
    params: {
      limit: 9999,
      where: { id: { manipulator: 'IN', value: values.map(({ id }) => id) } },
    },
  });

  const renderedData = useMemo(
    () =>
      data?.data.map((item) => ({
        id: item.id,
        label: Mustache.render(labelConstructor, item),
      })),
    [data]
  );

  const rows = renderedData?.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.id}</Table.Td>
      <Table.Td>{element.label}</Table.Td>
      <Table.Td>
        <Link
          target="_blank"
          to={pageUrls.entryTypes(targetModelTableName).view(element.id)}
        >
          <Text size="sm" color="blue">
            <ExternalLink size={15} className="mr-1 relative top-0.5" />
          </Text>
        </Link>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table verticalSpacing="md" horizontalSpacing="lg" striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th className="w-12">ID</Table.Th>
          <Table.Th></Table.Th>
          <Table.Th className="w-12"></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};

const MultipleSelect: FC<RelationshipItemSelectProps> = ({
  title,
  targetModelTableName,
  columnName,
  labelConstructor,
  readonly,
}) => {
  const [selectOpen, { toggle: toggleSelectOpen }] = useDisclosure();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data } = useModelItems(targetModelTableName, { params: { page } });
  const { field } = useController<
    Record<typeof columnName, EntityLink<any>[] | undefined>
  >({
    name: columnName,
  });

  const values = useMemo(
    () =>
      data?.data?.map((entry) => ({
        id: entry.id,
        value: String(entry.id),
        label: Mustache.render(labelConstructor, entry),
      })),
    [data, t, labelConstructor]
  );

  const toggleItem = (incommingItem: EntityLink<any>) => {
    const nextValue = [...(field.value ?? [])];
    const selectedIndex = nextValue.findIndex(
      (item) => item.id === incommingItem.id
    );

    if (selectedIndex > -1) {
      nextValue.splice(selectedIndex, 1);
    } else {
      nextValue.push({ id: incommingItem.id });
    }

    field.onChange(nextValue);
  };

  return (
    <>
      <Input.Wrapper
        size="md"
        classNames={{
          label: 'flex w-full items-center',
        }}
        label={
          <>
            <span>{title}</span>
            {/* {!readonly ? (
              <>
                <Button size="compact-sm" color="green" className="ml-auto">
            {t(MESSAGES.ADD_EXISTING)}
          </Button>
                <Button
                  size="compact-sm"
                  color="green"
                  className="ml-auto"
                  onClick={toggleSelectOpen}
                >
                  {t(MESSAGES.SELECT_EXISTING)}
                </Button>
              </>
            ) : null} */}
          </>
        }
      >
        <Paper className="mt-1">
          {(field.value?.length ?? 0) > 0 ? (
            <Suspense fallback={<Skeleton className="w-full h-24" />}>
              <MultipleDisplay
                values={field.value ?? []}
                targetModelTableName={targetModelTableName}
                labelConstructor={labelConstructor}
              />
            </Suspense>
          ) : (
            <ItemsMissingMessage className="py-5" />
          )}
        </Paper>
      </Input.Wrapper>

      <Drawer.Root
        opened={selectOpen}
        onClose={toggleSelectOpen}
        position="right"
        offset={8}
        radius="md"
        size="lg"
        classNames={{
          header: 'dark:bg-transparent',
        }}
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>{t(MESSAGES.SELECT_EXISTING)}</Drawer.Title>
            <Drawer.CloseButton />
            <Button
              size="compact-sm"
              color="green"
              className="ml-2"
              onClick={toggleSelectOpen}
            >
              OK
            </Button>
          </Drawer.Header>
          <Drawer.Body>
            {values?.map((item) => {
              const selected = !!field.value?.find(
                (currentItem) => currentItem.id === item.id
              );

              return (
                <div className="relative" key={item.id}>
                  <Checkbox
                    classNames={{
                      root: 'absolute top-2.5 left-2.5 pointer-none',
                      input: selected ? '' : 'bg-transparent dark:bg-gray-50',
                    }}
                    checked={selected}
                    onChange={() => toggleItem(item)}
                    tabIndex={-1}
                    size="md"
                    aria-label="Select linked"
                  />
                  <UnstyledButton
                    className={clsx(
                      'rounded-prom border-2 w-full pl-12 py-1.5 border-solid dark:border-dashed',
                      selected
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-100 dark:bg-gray-900 dark:backdrop-blur-lg dark:bg-opacity-65'
                    )}
                    onClick={() => toggleItem(item)}
                  >
                    <Text
                      className={clsx(
                        'font-bold text-lg',
                        selected
                          ? 'text-gray-800'
                          : 'dark:text-white text-gray-800'
                      )}
                    >
                      {item.label}
                    </Text>
                  </UnstyledButton>
                </div>
              );
            })}
            <div className="flex justify-center my-5">
              <Pagination
                disabled={data?.last_page === 1 || !data?.last_page}
                value={page}
                total={data?.last_page ?? 0}
                onChange={setPage}
              />
            </div>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
};

const SingleSelect: FC<RelationshipItemSelectProps> = ({
  columnName,
  title,
  error,
  targetModelTableName,
  labelConstructor,
  disabled,
}) => {
  const { t } = useTranslation();
  const { data, isError, isLoading } = useModelItems(targetModelTableName);
  const { field } = useController<Record<typeof columnName, EntityLink<any>>>({
    name: columnName,
  });

  const values = useMemo<ComboboxItem[] | undefined>(
    () =>
      data?.data?.map((entry) => ({
        value: String(entry.id),
        label: Mustache.render(labelConstructor, entry),
      })),
    [data, t, labelConstructor]
  );

  return (
    <div className="w-full">
      <Select
        data={
          values ??
          (field.value
            ? [
                {
                  value: String(field.value?.id),
                  label: Mustache.render(labelConstructor, field.value),
                },
              ]
            : undefined)
        }
        key={columnName}
        label={title}
        value={field.value ? String(field.value?.id) : null}
        onChange={(value) => {
          let nextValue: null | { id: number } = null;

          if (value) {
            const foundValue = data?.data.find(
              (item) => item.id === Number(value)
            );

            if (foundValue) {
              nextValue = { id: foundValue.id };
            }
          }

          field.onChange(nextValue);
        }}
        className="w-full"
        placeholder={t(MESSAGES.SELECT_PLACEHOLDER)}
        disabled={isError || isLoading || disabled}
        comboboxProps={{ shadow: 'xl' }}
        error={error}
      />
      {field.value && !Array.isArray(field.value) ? (
        <Link
          target="_blank"
          to={pageUrls.entryTypes(targetModelTableName).view(field.value?.id)}
        >
          <Text size="sm" color="blue">
            <ExternalLink size={15} className="mr-1 relative top-0.5" />
            {MESSAGES.SHOW_SELECTED_ITEM}
          </Text>
        </Link>
      ) : null}
    </div>
  );
};

export const RelationshipItemSelect: FC<RelationshipItemSelectProps> = (
  props
) => (
  <div className="w-full">
    {props.multiple ? (
      <MultipleSelect {...props} />
    ) : (
      <SingleSelect {...props} />
    )}
  </div>
);
