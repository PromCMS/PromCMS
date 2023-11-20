import {
  EditorOptions,
  EditorProvider,
  HTMLContent,
  JSONContent,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, Suspense, FC } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Placeholder } from '../_extensions/Placeholder';
import Gapcursor from '@tiptap/extension-gapcursor';
import Dropcursor from '@tiptap/extension-dropcursor';
import { ActionsAfter } from './ActionsAfter';
import { FloatingMenu } from './FloatingMenu';
import { MenuBefore } from './MenuBefore';
import { BubbleMenu } from './BubbleMenu';
import { ImageAlbumExtension } from './extensions/ImageAlbumExtension';
import { LayoutExtension } from './extensions/LayoutExtension';
import { ImageExtension } from './extensions/ImageExtension';

export type EditorProps = Pick<
  Partial<EditorOptions>,
  'onUpdate' | 'onBlur' | 'editable'
> & {
  value: JSONContent | HTMLContent;
};

const extensions = [
  StarterKit.configure({}),
  Placeholder,
  ImageAlbumExtension,
  LayoutExtension,
  ImageExtension,
  // Dropcursor,
];

export type BlockEditorProps = {
  name: string;
  disabled?: boolean;
};

export const BlockEditor: FC<BlockEditorProps> = ({ name, disabled }) => {
  const { t } = useTranslation();
  const { field, fieldState } = useController({
    name,
  });
  const handleChange = useCallback<NonNullable<EditorProps['onUpdate']>>(
    ({ editor }) => field.onChange(JSON.stringify(editor.getJSON())),
    [field.onChange]
  );

  const before = (
    <>
      <MenuBefore />
      <FloatingMenu />
      <BubbleMenu />
    </>
  );

  const after = (
    <>
      {fieldState.error && (
        <small className="font-bold text-red-500">
          {fieldState.error.message}
        </small>
      )}
      <ActionsAfter />
    </>
  );

  // TODO: implement disabled
  return (
    <Suspense
      fallback={
        <div className="min-h-[350px]">
          {t('Loading editor, please wait...')}
        </div>
      }
    >
      <div className="mb-10">
        <EditorProvider
          children={null}
          onBlur={field.onBlur}
          onUpdate={handleChange}
          editable={!disabled}
          extensions={extensions}
          content={field.value}
          slotBefore={before}
          slotAfter={after}
        />
      </div>
    </Suspense>
  );
};
