import { EDITOR_MESSAGES, MESSAGES, SIMPLE_WORDS } from '@constants';
import { ActionIcon, Divider, Tooltip } from '@mantine/core';
import { useCurrentEditor } from '@tiptap/react';
import clsx from 'clsx';
import { FC, forwardRef, MouseEventHandler, useCallback } from 'react';
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

const Action = forwardRef<
  HTMLButtonElement,
  {
    icon: Icon;
    label: string;
    active?: boolean;
    className?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    canBeDisabled?: boolean;
  }
>(
  (
    {
      icon: Icon,
      onClick,
      active,
      className,
      label,
      disabled,
      canBeDisabled = true,
    },
    ref
  ) => (
    <Tooltip disabled={disabled} label={label} withArrow transition="scale">
      <ActionIcon
        ref={ref}
        variant="filled"
        color="blue"
        disabled={disabled}
        className={clsx(
          active
            ? 'bg-sky-100 text-sky-600'
            : 'bg-white hover:bg-gray-50 text-gray-700',

          active
            ? canBeDisabled
              ? 'hover:bg-red-200 hover:text-red-600'
              : 'hover:bg-sky-100 hover:text-sky-600'
            : '',
          disabled ? 'cursor-not-allowed' : '',
          className
        )}
        onClick={onClick}
      >
        <Icon className="w-3/4 h-3/4" />
      </ActionIcon>
    </Tooltip>
  )
);

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
      <Action
        onClick={() => editor?.chain().focus().toggleBold()?.run()}
        icon={Bold}
        active={editor?.isActive('bold')}
        label={t(EDITOR_MESSAGES.BOLD)}
      />
      <Action
        onClick={() => editor?.chain().focus().toggleItalic()?.run()}
        icon={Italic}
        active={editor?.isActive('italic')}
        label={t(EDITOR_MESSAGES.ITALIC)}
      />
      <Action
        label={t(EDITOR_MESSAGES.CLEAR_ALL_FORMATTING)}
        icon={ClearFormatting}
        onClick={() => editor?.chain().focus().unsetAllMarks().run()}
      />
      {divider}
      <Action
        onClick={() => editor?.chain().focus().toggleBulletList()?.run()}
        icon={List}
        active={editor?.isActive('bulletList')}
        label={t(EDITOR_MESSAGES.BULLET_LIST)}
      />
      <Action
        onClick={() => editor?.chain().focus().toggleOrderedList()?.run()}
        icon={ListNumbers}
        active={editor?.isActive('orderedList')}
        label={t(EDITOR_MESSAGES.ORDERED_LIST)}
      />
      {divider}
      {ALLOWED_HEADING_LEVELS.map((level) => (
        <Action
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
        <Action
          canBeDisabled={false}
          key={align}
          onClick={() => editor?.chain().setTextAlign(align).run()}
          icon={TEXT_ALIGN_TO_ICON[align]}
          active={editor?.isActive({ textAlign: align })}
          label={t(EDITOR_MESSAGES[`TEXT_ALIGN_${align.toUpperCase()}`])}
        />
      ))}
      {divider}
      <Action
        icon={Link}
        active={editor?.isActive('link')}
        onClick={setLink}
        label={t(SIMPLE_WORDS.LINK)}
      />
      <Action
        onClick={() => editor?.chain().toggleBlockquote().run()}
        icon={Blockquote}
        active={editor?.isActive('blockquote')}
        label={t(EDITOR_MESSAGES.BLOCKQUOTE)}
      />
      {divider}
      <Action
        onClick={() => editor?.chain().undo()?.run()}
        icon={ArrowBackUp}
        disabled={!editor?.can().undo()}
        label={t(EDITOR_MESSAGES.UNDO)}
      />
      <Action
        onClick={() => editor?.chain().redo()?.run()}
        icon={ArrowForwardUp}
        disabled={!editor?.can().redo()}
        label={t(EDITOR_MESSAGES.REDO)}
      />

      {process.env.NODE_ENV !== 'production' ? (
        <Action
          onClick={() => console.log(editor?.getJSON())}
          icon={Bug}
          className="ml-auto"
          label="Print JSON value into console"
        />
      ) : null}
    </div>
  );
};
