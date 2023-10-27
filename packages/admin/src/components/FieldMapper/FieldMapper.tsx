import { ColumnType, FieldPlacements } from '@prom-cms/schema';
import { FC } from 'react';
import { FieldMapperItem } from './FieldMapperItem';

export interface FieldMapperProps {
  type: FieldPlacements;
  fields: (ColumnType & {
    columnName: string;
  })[][];
}

const FieldMapper: FC<FieldMapperProps> = ({ fields, type: placement }) => {
  return (
    <>
      {fields.map((rowItems, rowIndex) =>
        rowItems.length ? (
          <div key={rowIndex} className="grid w-full gap-5">
            {rowItems.map((values) => (
              <FieldMapperItem
                key={values.columnName}
                placement={placement}
                {...values}
              />
            ))}
          </div>
        ) : null
      )}
    </>
  );
};

export default FieldMapper;
