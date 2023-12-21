import { LoadingOverlay } from '@mantine/core';
import clsx from 'clsx';
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import { useFormState } from 'react-hook-form';

import { ColumnType, FieldPlacements } from '@prom-cms/schema';

import { FieldMapperItem } from './FieldMapperItem';

export interface FieldMapperProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  type: FieldPlacements;
  fields: ColumnType[];
}

const FieldMapper: FC<FieldMapperProps> = ({
  fields,
  type: placement,
  className,
  ...rest
}) => {
  const formState = useFormState();

  return (
    <div className={clsx('space-y-4 sm:-ml-4 flow-root', className)} {...rest}>
      {fields.map((field) => (
        <div
          key={field.name}
          className={clsx(
            `sm:float-left sm:field-mapper-item-${
              field.admin.editor.width ?? 12
            }`
          )}
        >
          <FieldMapperItem placement={placement} {...field} />
        </div>
      ))}
      <LoadingOverlay visible={formState.isSubmitting} zIndex={20} />
    </div>
  );
};

export default FieldMapper;
