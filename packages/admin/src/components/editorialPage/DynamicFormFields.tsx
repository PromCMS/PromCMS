import {
  ApiResultModel,
  ApiResultModelSingleton,
  ColumnType,
} from '@prom-cms/shared';
import { forwardRef, MutableRefObject, RefObject, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import type EditorJS from '@editorjs/editorjs';
import { BlockEditor } from '@components/form/BlockEditor';
import FieldMapper, { prepareFieldsForMapper } from '@components/FieldMapper';
import { ResultItem } from '@prom-cms/api-client';

export interface DynamicFormFieldsProps {
  modelInfo: ApiResultModel | ApiResultModelSingleton;
  itemData?: ResultItem;
}

export const DynamicFormFields = forwardRef<
  { editorRef: RefObject<EditorJS> },
  DynamicFormFieldsProps
>(function FormContent({ itemData, modelInfo }, refs) {
  // We receive multiple refs and destructure them
  const { editorRef } =
    (refs as MutableRefObject<{ editorRef: RefObject<EditorJS> }>)?.current ||
    {};
  const { formState } = useFormContext();

  const groupedFields = useMemo<
    Array<ColumnType & { columnName: string }>[] | undefined
  >(() => {
    if (!modelInfo) return;

    return prepareFieldsForMapper(modelInfo);
  }, [modelInfo]);

  if (!groupedFields) return null;

  return (
    <div className="flex min-h-screen flex-col gap-5">
      {modelInfo?.admin?.layout === 'simple' ? (
        groupedFields && <FieldMapper fields={groupedFields} />
      ) : (
        <BlockEditor initialValue={itemData?.content} ref={editorRef} />
      )}
      {formState.isSubmitting && (
        <div className="absolute inset-0 cursor-progress bg-white/20 backdrop-blur-[2px]" />
      )}
    </div>
  );
});
