import {
  ApiResultModel,
  ApiResultModelSingleton,
  ColumnType,
  FieldPlacements,
} from '@prom-cms/shared';
import { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import FieldMapper, { prepareFieldsForMapper } from '@components/FieldMapper';

export interface DynamicFormFieldsProps {
  modelInfo: ApiResultModel | ApiResultModelSingleton;
}

export const DynamicFormFields: FC<DynamicFormFieldsProps> = ({
  modelInfo,
}) => {
  const { formState } = useFormContext();

  const groupedFields = useMemo<
    Array<ColumnType & { columnName: string }>[] | undefined
  >(() => {
    if (!modelInfo) return;

    return prepareFieldsForMapper(modelInfo, FieldPlacements.MAIN);
  }, [modelInfo]);

  if (!groupedFields) return null;

  return (
    <div className="flex min-h-screen flex-col gap-5 sm:gap-8 mb-10">
      <FieldMapper type={FieldPlacements.MAIN} fields={groupedFields} />
      {formState.isSubmitting && (
        <div className="absolute inset-0 cursor-progress bg-white/20 backdrop-blur-[2px]" />
      )}
    </div>
  );
};
