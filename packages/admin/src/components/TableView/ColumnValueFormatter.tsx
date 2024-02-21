import BackendImage from '@components/BackendImage';
import { MESSAGES, pageUrls } from '@constants';
import { EntityLink } from '@custom-types';
import {
  ActionIcon,
  Drawer,
  NumberFormatter,
  Skeleton,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from '@tanstack/react-router';
import { useModelItem } from 'hooks/useModelItem';
import Mustache from 'mustache';
import { FC, Fragment, Suspense, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Eye, X } from 'tabler-icons-react';

import { ColumnTypeRelationship } from '@prom-cms/schema';

import { TableViewCol } from './TableView';
import { useClassNames } from './useClassNames';

type ColumnValueFormatterProps = TableViewCol & { value: any };

const LazyRelationshipItem: FC<
  ColumnTypeRelationship & { value: EntityLink<any> }
> = (column) => {
  const hasOnlyId = Object.keys(column.value).length === 1;

  const { data, error } = useModelItem(
    column.targetModelTableName,
    column.value?.id,
    undefined,
    {
      suspense: true,
      useErrorBoundary: false,
      refetchInterval: 0,
      refetchOnReconnect: false,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      enabled: hasOnlyId,
    }
  );

  const text = useMemo(() => {
    const renderParams = data ?? column.value;

    return renderParams
      ? Mustache.render(column.labelConstructor, renderParams)
      : '';
  }, [data, column.value, column.labelConstructor]);

  if (error) {
    return <X className="text-red-600" />;
  }

  return <p>{text}</p>;
};

const LongTextItem: FC<{ value: string }> = ({ value }) => {
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title={t(MESSAGES.CONTENT)}
        position="bottom"
        classNames={{
          header: 'container mx-auto border-b border-blue-300 py-3',
          title: 'text-xl',
          body: 'container mx-auto',
        }}
      >
        <div
          className="wysiwyg-editor"
          dangerouslySetInnerHTML={{ __html: value }}
        ></div>
      </Drawer>
      <Tooltip
        multiline
        withArrow
        withinPortal
        label={t(MESSAGES.PREVIEW_CONTENT)}
      >
        <ActionIcon onClick={open}>
          <Eye size={18} />
        </ActionIcon>
      </Tooltip>
    </>
  );
};

export const ColumnValueFormatter: FC<ColumnValueFormatterProps> = memo(
  function ColumnValueFormatter(column) {
    const classNames = useClassNames();
    const { t } = useTranslation();

    switch (column.type) {
      case 'file':
        if (column.typeFilter?.includes('image')) {
          return (
            <div className="w-14 aspect-square relative inline-block">
              <BackendImage
                quality={60}
                width={56}
                iconSize={20}
                imageId={
                  column.multiple ? column.value?.at(0).id : column.value?.id
                }
                className="absolute top-0 left-0 w-full h-full object-contain rounded-lg"
              />
              {column.multiple && column.value?.length - 1 > 0 ? (
                <div className="px-1 flex absolute items-center justify-center aspect-square -top-2 -right-2 rounded-prom shadow-md border border-gray-200 bg-blue-50/50 font-semibold text-blue-600">
                  +{column.value?.length - 1}
                </div>
              ) : null}
            </div>
          );
        } else if (column.value) {
          return (
            <>
              {(Array.isArray(column.value)
                ? column.value
                : [column.value]
              ).map((fileId, index, allItems) => (
                <Fragment key={fileId}>
                  <Link
                    to={pageUrls.files.view(fileId)}
                    title={t(MESSAGES.VIEW_FILE)}
                    className={classNames.tableDataParagraph}
                  >
                    ID: {fileId}
                  </Link>
                  {allItems.length - 1 !== index ? ', ' : ''}
                </Fragment>
              ))}
            </>
          );
        }
        break;
      case 'json':
        if (column.admin.fieldType === 'color' && column.value?.value) {
          return (
            <div
              className="w-8 h-8 rounded-full shadow-md border border-blue-200"
              style={{ background: column.value.value }}
            ></div>
          );
        } else if (
          column.admin.fieldType === 'linkButton' &&
          column.value?.href
        ) {
          return (
            <a href={column.value.href} target="_blank">
              {column.value.label ?? column.value.href}
            </a>
          );
        } else if (column.value) {
          return (
            <p
              title={JSON.stringify(column.value)}
              className={classNames.tableDataParagraph}
            >
              {'{'} ... {'}'}
            </p>
          );
        }
        break;
      case 'boolean':
        return column.value ? (
          <Check className="text-green-600" />
        ) : (
          <X className="text-red-600" />
        );

      case 'relationship':
        if (column.value && !column.multiple) {
          return (
            <Suspense
              fallback={<Skeleton height="1.2rem" className="max-w-[100px]" />}
            >
              <LazyRelationshipItem {...column} />
            </Suspense>
          );
        }

        break;

      case 'url':
        if (column.value) {
          return (
            <a href={column.value} target="_blank">
              {column.value}
            </a>
          );
        }

      case 'number':
        if (typeof column.value === 'number') {
          return (
            <p
              className={classNames.tableDataParagraph}
              title={String(column.value)}
            >
              <NumberFormatter
                prefix={
                  'prefix' in column && column.prefix
                    ? Mustache.render(column.prefix, column.value)
                    : undefined
                }
                value={column.value}
                thousandSeparator=" "
                suffix={
                  'suffix' in column && column.suffix
                    ? Mustache.render(column.suffix, column.value)
                    : undefined
                }
              />
            </p>
          );
        }
        break;

      case 'longText':
        if (column.value) {
          return <LongTextItem value={column.value} />;
        }
      // fallback to normal return
      default:
        break;
    }

    return (
      <p className={classNames.tableDataParagraph} title={column.value}>
        {column.value ? (
          column.value
        ) : (
          <span className="opacity-40 text-gray-700 dark:text-white">
            {t(MESSAGES.EMPTY_VALUE)}
          </span>
        )}
      </p>
    );
  }
);
