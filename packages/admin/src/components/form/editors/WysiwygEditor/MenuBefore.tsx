import { EDITOR_MESSAGES, MESSAGES, SIMPLE_WORDS } from '@constants';
import { Divider } from '@mantine/core';
import { useCurrentEditor } from '@tiptap/react';
import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlignCenter,
  AlignJustified,
  AlignLeft,
  AlignRight,
  ArrowBackUp,
  ArrowForwardUp,
  Blockquote,
  Bold,
  Bug,
  ClearFormatting,
  H2,
  H3,
  H4,
  Icon,
  Italic,
  Link,
  List,
  ListNumbers,
} from 'tabler-icons-react';

import { ActionButton } from '../_extensions/ActionButton';

const ALLOWED_HEADING_LEVELS = [2, 3, 4] as const;
const ALLOWED_TEXT_ALIGNS = ['left', 'center', 'right', 'justify'] as const;

const TEXT_ALIGN_TO_ICON: Record<(typeof ALLOWED_TEXT_ALIGNS)[number], Icon> = {
  left: AlignLeft,
  center: AlignCenter,
  right: AlignRight,
  justify: AlignJustified,
};
const HEADING_LEVEL_TO_ICON: Record<
  (typeof ALLOWED_HEADING_LEVELS)[number],
  Icon
> = {
  2: H2,
  3: H3,
  4: H4,
};

export const MenuBefore: FC = () => {
  const { t } = useTranslation();
  const { editor } = useCurrentEditor();

  const divider = (
    <Divider orientation="vertical" className="h-3 my-auto mx-1" />
  );

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt(t(MESSAGES.ENTER_YOUR_LINK), previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();

      return;
    }

    editor
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();
  }, [editor]);

  return (
    <div className="border-2 border-gray-100 border-b-0 rounded-t-lg p-1.5 bg-white sticky top-0 z-10 flex gap-1">
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
      <ActionButton
        onClick={() => editor?.chain().focus().toggleBulletList()?.run()}
        icon={List}
        active={editor?.isActive('bulletList')}
        label={t(EDITOR_MESSAGES.BULLET_LIST)}
      />
      <ActionButton
        onClick={() => editor?.chain().focus().toggleOrderedList()?.run()}
        icon={ListNumbers}
        active={editor?.isActive('orderedList')}
        label={t(EDITOR_MESSAGES.ORDERED_LIST)}
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
      {divider}
      {ALLOWED_TEXT_ALIGNS.map((align) => (
        <ActionButton
          canBeDisabled={false}
          key={align}
          onClick={() => editor?.chain().setTextAlign(align).run()}
          icon={TEXT_ALIGN_TO_ICON[align]}
          active={editor?.isActive({ textAlign: align })}
          label={t(EDITOR_MESSAGES[`TEXT_ALIGN_${align.toUpperCase()}`])}
        />
      ))}
      {divider}
      <ActionButton
        icon={Link}
        active={editor?.isActive('link')}
        onClick={setLink}
        label={t(SIMPLE_WORDS.LINK)}
      />
      <ActionButton
        onClick={() => editor?.chain().toggleBlockquote().run()}
        icon={Blockquote}
        active={editor?.isActive('blockquote')}
        label={t(EDITOR_MESSAGES.BLOCKQUOTE)}
      />
      {divider}
      <ActionButton
        onClick={() => editor?.chain().undo()?.run()}
        icon={ArrowBackUp}
        disabled={!editor?.can().undo()}
        label={t(EDITOR_MESSAGES.UNDO)}
      />
      <ActionButton
        onClick={() => editor?.chain().redo()?.run()}
        icon={ArrowForwardUp}
        disabled={!editor?.can().redo()}
        label={t(EDITOR_MESSAGES.REDO)}
      />

      {process.env.NODE_ENV !== 'production' ? (
        <ActionButton
          onClick={() => console.log(editor?.getJSON())}
          icon={Bug}
          className="ml-auto"
          label="Print JSON value into console"
        />
      ) : null}
    </div>
  );
};
