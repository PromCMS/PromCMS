import { LoadingOverlay } from '@mantine/core';
import { ColumnType, FieldPlacements } from '@prom-cms/schema';
import clsx from 'clsx';
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import { useFormState } from 'react-hook-form';
import { FieldMapperItem } from './FieldMapperItem';

export interface FieldMapperProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  type: FieldPlacements;
  fields: (ColumnType & {
    columnName: string;
  })[];
}

const FieldMapper: FC<FieldMapperProps> = ({
  fields,
  type: placement,
  className,
  ...rest
}) => {
  const formState = useFormState();

  return (
    <div className={clsx('space-y-4 sm:-ml-4', className)} {...rest}>
      {fields.map((field) => {
        const width = field.admin.editor.width ?? 12;

        return (
          <div
            key={field.columnName}
            className={clsx(`sm:float-left sm:field-mapper-item-${width}`)}
          >
            <FieldMapperItem placement={placement} {...field} />
          </div>
        );
      })}
      <LoadingOverlay visible={formState.isSubmitting} zIndex={20} />
    </div>
  );
};

export default FieldMapper;
