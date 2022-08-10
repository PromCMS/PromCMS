import { forwardRef, useCallback, lazy } from 'react';
import type EditorJS from '@editorjs/editorjs';
import { Controller, useFormContext } from 'react-hook-form';
import type { LazyEditorProps } from './LazyEditor';
import { useTranslation } from 'react-i18next';

const LazyEditor = lazy(async () => await import('./LazyEditor'));

export type BlockEditorProps = LazyEditorProps;

export const BlockEditor = forwardRef<EditorJS, BlockEditorProps>(
  function BlockEditor(props, editorRef) {
    const { control } = useFormContext();
    const { t } = useTranslation();

    const onEditorChange = useCallback(
      (onChange) => async (api: EditorJS.API) =>
        onChange(JSON.stringify(await api.saver.save())),
      []
    );

    return (
      <Controller
        control={control}
        name="content"
        render={({ field: { onChange, name }, formState: { errors } }) => (
          <LazyEditor
            editorRef={editorRef}
            onChange={onEditorChange(onChange)}
            placeholder={t('Start typing here...') as string}
            error={errors?.[name]?.message as unknown as string}
            className="mb-20"
            {...props}
          />
        )}
      />
    );
  }
);
