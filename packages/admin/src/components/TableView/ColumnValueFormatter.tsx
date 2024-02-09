import BackendImage from '@components/BackendImage';
import { MESSAGES, pageUrls } from '@constants';
import { ActionIcon, Drawer, Skeleton, Tooltip } from '@mantine/core';
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

const LazyRelationshipItem: FC<ColumnTypeRelationship & { value: any }> = (
  column
) => {
  const { data, error } = useModelItem(
    column.targetModelTableName,
    column.value,
    undefined,
    {
      suspense: true,
      useErrorBoundary: false,
      refetchInterval: 0,
      refetchOnReconnect: false,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  const text = useMemo(
    () => (data ? Mustache.render(column.labelConstructor, data) : ''),
    [data, column.labelConstructor]
  );

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
          header: 'container mx-auto border-b border-gray-300 py-3',
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
          <Eye />
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
            <div className="w-14 aspect-square relative">
              <BackendImage
                quality={60}
                width={56}
                iconSize={20}
                imageId={column.value}
                className="absolute top-0 left-0 w-full h-full object-contain rounded-lg"
              />
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
              className="w-8 h-8 rounded-full shadow-md border border-gray-200"
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
        if (column.value) {
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
          <span className="opacity-40 text-blue-700">
            {t(MESSAGES.EMPTY_VALUE)}
          </span>
        )}
      </p>
    );
  }
);
