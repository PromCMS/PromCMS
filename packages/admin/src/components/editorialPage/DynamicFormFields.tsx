import FieldMapper, { prepareFieldsForMapper } from '@components/FieldMapper';
import { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { ApiResultModel, ApiResultModelSingleton } from '@prom-cms/api-client';
import { ColumnType, FieldPlacements } from '@prom-cms/schema';

export interface DynamicFormFieldsProps {
  modelInfo: ApiResultModel | ApiResultModelSingleton;
}

export const DynamicFormFields: FC<DynamicFormFieldsProps> = ({
  modelInfo,
}) => {
  const { formState } = useFormContext();

  const groupedFields = useMemo<ColumnType[] | undefined>(() => {
    if (!modelInfo) return;

    return prepareFieldsForMapper(modelInfo, FieldPlacements.MAIN);
  }, [modelInfo]);

  if (!groupedFields) return null;

  return (
    <FieldMapper
      className="mb-10 min-h-screen"
      type={FieldPlacements.MAIN}
      fields={groupedFields}
    />
  );
};
