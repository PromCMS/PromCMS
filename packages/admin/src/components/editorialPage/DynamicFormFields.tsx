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
    <div className="mb-10 flex min-h-screen flex-wrap gap-y-6 -mx-2 content-baseline">
      <FieldMapper type={FieldPlacements.MAIN} fields={groupedFields} />
      {formState.isSubmitting && (
        <div className="absolute inset-0 cursor-progress bg-white/20 backdrop-blur-[2px]" />
      )}
    </div>
  );
};
