import BackendImage from '@components/BackendImage';
import { FC, Fragment, memo } from 'react';
import { Link } from 'react-router-dom';
import { Check, X } from 'tabler-icons-react';
import { TableViewCol } from './TableView';
import { useClassNames } from './useClassNames';
import { MESSAGES, pageUrls } from '@constants';
import { useTranslation } from 'react-i18next';

export const ColumnValueFormatter: FC<TableViewCol & { value: any }> = memo(
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
        if (column.admin.fieldType === 'color') {
          return (
            <div
              className="w-8 h-8 rounded-full"
              style={{ background: column.value.value }}
            ></div>
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