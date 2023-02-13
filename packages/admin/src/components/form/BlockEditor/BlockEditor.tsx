import { useCallback, lazy, Suspense, FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { LazyEditorProps } from './LazyEditor';
import { useTranslation } from 'react-i18next';

const LazyEditor = lazy(async () => await import('./LazyEditor'));

export type BlockEditorProps = LazyEditorProps & {
  name: string;
};

export const BlockEditor: FC<BlockEditorProps> = ({ name, ...props }) => {
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
      name={name}
      render={({ field: { onChange, value }, formState: { errors } }) => (
        <Suspense
          fallback={
            <div className="min-h-[350px]">
              {t('Loading editor, please wait...')}
            </div>
          }
        >
          <LazyEditor
            name={name}
            onChange={onEditorChange(onChange)}
            placeholder={t('Start typing here...') as string}
            error={errors?.[name]?.message as unknown as string}
            className="mb-20"
            initialValue={value}
            {...props}
          />
        </Suspense>
      )}
    />
  );
};
