import { ColumnType, FieldPlacements } from '@prom-cms/schema';
import clsx from 'clsx';
import { FC } from 'react';
import { FieldMapperItem } from './FieldMapperItem';

export interface FieldMapperProps {
  type: FieldPlacements;
  fields: (ColumnType & {
    columnName: string;
  })[];
}

const FieldMapper: FC<FieldMapperProps> = ({ fields, type: placement }) => {
  return (
    <>
      {fields.map((field) => {
        const width = field.admin.editor.width ?? 12;

        return (
          <div
            key={field.columnName}
            className={clsx('px-2', width === 12 ? 'w-full' : `w-${width}/12`)}
          >
            <FieldMapperItem placement={placement} {...field} />
          </div>
        );
      })}
    </>
  );
};

export default FieldMapper;
