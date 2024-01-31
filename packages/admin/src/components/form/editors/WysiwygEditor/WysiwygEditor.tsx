import { Input } from '@mantine/core';
import { Editor as CoreEditor } from '@tiptap/core';
import { EditorProvider, EditorProviderProps } from '@tiptap/react';
import clsx from 'clsx';
import { FC, useCallback, useEffect, useRef } from 'react';
import { useController } from 'react-hook-form';

import { MenuBefore } from './MenuBefore';
import { useExtensions } from './useExtensions';

export type WysiwygEditorProps = {
  name: string;
  label?: string;
  disabled?: boolean;
};

/**
 * TipTap wysiwyg editor, controller is already wired inside this component
 */
export const WysiwygEditor: FC<WysiwygEditorProps> = ({
  name,
  label,
  disabled,
}) => {
  const editorRef = useRef<CoreEditor | null>(null);
  const { field, fieldState } = useController({
    name,
  });
  const handleChange = useCallback<
    NonNullable<EditorProviderProps['onUpdate']>
  >(
    ({ editor }) => {
      field.onChange(editor.getHTML());
    },
    [field.onChange, name]
  );

  // This is kind of hacky way - maybe we should wait for content to load into form and then render
  // and this should be redundant
  // (initial content is undefined and then it loads)
  useEffect(() => {
    if (field.value && editorRef.current?.isEmpty) {
      editorRef.current?.commands.setContent(field.value);
    }
  }, [field.value]);

  return (
    <Input.Wrapper label={label} error={fieldState.error?.message}>
      <EditorProvider
        onCreate={({ editor }) => (editorRef.current = editor)}
        children={null}
        slotBefore={<MenuBefore />}
        onBlur={field.onBlur}
        onUpdate={handleChange}
        editable={!disabled}
        editorProps={{
          attributes() {
            return {
              class: clsx(
                'border-2 border-gray-100 rounded-b-lg  px-3 py-3 bg-white wysiwyg-editor min-h-[300px]'
              ),
            };
          },
        }}
        extensions={useExtensions()}
        content={field.value}
      />
    </Input.Wrapper>
  );
};
