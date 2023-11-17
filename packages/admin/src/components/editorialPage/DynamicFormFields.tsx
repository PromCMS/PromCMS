import { ApiResultModel, ApiResultModelSingleton } from '@prom-cms/shared';
import { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import FieldMapper, { prepareFieldsForMapper } from '@components/FieldMapper';
import { ColumnType, FieldPlacements } from '@prom-cms/schema';

export interface DynamicFormFieldsProps {
  modelInfo: ApiResultModel | ApiResultModelSingleton;
}

export const DynamicFormFields: FC<DynamicFormFieldsProps> = ({
  modelInfo,
}) => {
  const { formState } = useFormContext();

  const groupedFields = useMemo<
    Array<ColumnType & { columnName: string }> | undefined
  >(() => {
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
