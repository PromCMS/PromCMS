import { EDITOR_MESSAGES } from '@constants';
import { Paper } from '@mantine/core';
import { isTextSelection, useCurrentEditor } from '@tiptap/react';
import { BubbleMenuProps, BubbleMenu as TipTapBubbleMenu } from '@tiptap/react';
import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Bold, ClearFormatting, Italic } from 'tabler-icons-react';

import { ALLOWED_HEADING_LEVELS, HEADING_LEVEL_TO_ICON } from '../_constants';
import { ActionButton } from '../_extensions/ActionButton';
import { ActionButtonDivider } from '../_extensions/ActionButtonDivider';

export const BubbleMenu: FC = () => {
  const { editor } = useCurrentEditor();
  const { t } = useTranslation();

  const shouldShowBubbleMenu = useCallback<
    NonNullable<BubbleMenuProps['shouldShow']>
  >(({ editor, view, state, from, to }) => {
    const { doc, selection } = state;
    const { empty } = selection;

    // Sometime check for `empty` is not enough.
    // Doubleclick an empty paragraph returns a node size of 2.
    // So we check also for an empty text size.
    const isEmptyTextBlock =
      !doc.textBetween(from, to).length && isTextSelection(state.selection);

    const hasEditorFocus = view.hasFocus();
    const hasAlbumFocus = editor.isActive('imageAlbum');
    const hasImageFocus = editor.isActive('image');
    const hasLayoutFocus = editor.isActive('layout');

    const hasFocusOnIgnoredBlocks =
      hasAlbumFocus || hasImageFocus || hasLayoutFocus;

    if (
      !hasEditorFocus ||
      empty ||
      isEmptyTextBlock ||
      !editor.isEditable ||
      hasFocusOnIgnoredBlocks
    ) {
      return false;
    }

    return true;
  }, []);

  const divider = <ActionButtonDivider />;

  if (!editor) {
    return null;
  }

  return (
    <TipTapBubbleMenu
      editor={editor}
      shouldShow={shouldShowBubbleMenu}
      tippyOptions={{ duration: 300 }}
      className="flex"
    >
      <Paper p="0.2rem" className="flex flex-row gap-1 border-blue-200 border">
        <ActionButton
          onClick={() => editor?.chain().focus().toggleBold()?.run()}
          icon={Bold}
          active={editor?.isActive('bold')}
          label={t(EDITOR_MESSAGES.BOLD)}
        />
        <ActionButton
          onClick={() => editor?.chain().focus().toggleItalic()?.run()}
          icon={Italic}
          active={editor?.isActive('italic')}
          label={t(EDITOR_MESSAGES.ITALIC)}
        />
        <ActionButton
          label={t(EDITOR_MESSAGES.CLEAR_ALL_FORMATTING)}
          icon={ClearFormatting}
          onClick={() => editor?.chain().focus().unsetAllMarks().run()}
        />
        {divider}
        {ALLOWED_HEADING_LEVELS.map((level) => (
          <ActionButton
            key={level}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level })?.run()
            }
            icon={HEADING_LEVEL_TO_ICON[level]}
            active={editor?.isActive('heading', { level })}
            label={t(EDITOR_MESSAGES[`HEADING_LEVEL_${level}`])}
          />
        ))}
      </Paper>
    </TipTapBubbleMenu>
  );
};
