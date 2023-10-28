import BackendImage from '@components/BackendImage';
import { FC, Fragment, memo, Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Check, X } from 'tabler-icons-react';
import Mustache from 'mustache';

import { TableViewCol } from './TableView';
import { useClassNames } from './useClassNames';
import { MESSAGES, pageUrls } from '@constants';
import { useTranslation } from 'react-i18next';
import { ColumnTypeRelationship } from '@prom-cms/schema';
import { Skeleton } from '@mantine/core';
import { useModelItem } from '@hooks/useModelItem';

type ColumnValueFormatterProps = TableViewCol & { value: any };

const LazyRelationshipItem: FC<ColumnTypeRelationship & { value: any }> = (
  column
) => {
  const { data } = useModelItem(
    column.targetModel,
    column.value,
    {
      params: { unstable_fetchReferences: true },
    },
    {
      suspense: true,
      refetchInterval: 0,
      refetchOnReconnect: false,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  const text = useMemo(
    () => Mustache.render(column.labelConstructor, data),
    [data, column.labelConstructor]
  );

  return <p>{text}</p>;
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
                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
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
        if (column.admin.fieldType === 'color' && column.value.value) {
          return (
            <div
              className="w-8 h-8 rounded-full"
              style={{ background: column.value.value }}
            ></div>
          );
        } else if (
          column.admin.fieldType === 'linkButton' &&
          column.value.href
        ) {
          return (
            <a href={column.value.href} target="_blank">
              {column.value.label ?? column.value.href}
            </a>
          );
        } else if (column.value) {
          return <p className={classNames.tableDataParagraph}>...</p>;
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
