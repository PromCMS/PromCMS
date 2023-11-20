import { EDITOR_MESSAGES, SIMPLE_WORDS } from '@constants';
import { Popover, UnstyledButton } from '@mantine/core';
import { useCurrentEditor } from '@tiptap/react';
import { FloatingMenu as TipTapFloatingMenu } from '@tiptap/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Layout,
  List,
  ListNumbers,
  Photo,
  PhotoPlus,
  X,
} from 'tabler-icons-react';
import { ActionButton } from '../_extensions/ActionButton';
import { ActionButtonDivider } from '../_extensions/ActionButtonDivider';

export const FloatingMenu: FC = () => {
  const { t } = useTranslation();
  const { editor } = useCurrentEditor();

  const divider = <ActionButtonDivider />;

  if (!editor) {
    return null;
  }

  return (
    <TipTapFloatingMenu
      editor={editor}
      tippyOptions={{
        placement: 'right-start',
        duration: 100,
        animation: 'scale',
        interactive: true,
        offset: [0, 0],
      }}
    >
      <span className="text-gray-400" onClick={() => editor.chain().focus()}>
        {t(EDITOR_MESSAGES.PLACEHOLDER_PARAGRAPH)} nebo {''}
      </span>
      <Popover position="top-start" offset={-28}>
        <Popover.Target>
          <UnstyledButton className="inline-block text-blue-500 hover:underline">
            vyberte blok
          </UnstyledButton>
        </Popover.Target>
        <Popover.Dropdown p="0.2rem" className="flex flex-flow">
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
          <ActionButton
            onClick={() => editor?.chain().focus().addImage()?.run()}
            icon={Photo}
            label={t(SIMPLE_WORDS.PHOTO)}
          />
          <ActionButton
            onClick={() => editor?.chain().focus().addAlbum()?.run()}
            icon={PhotoPlus}
            active={editor?.isActive('orderedList')}
            label={t(SIMPLE_WORDS.PHOTO_ALBUM)}
          />
          {divider}
          <ActionButton
            onClick={() => editor?.chain().focus().addLayout()?.run()}
            icon={Layout}
            active={editor?.isActive('orderedList')}
            label={t(SIMPLE_WORDS.PHOTO_ALBUM)}
          />
          {divider}
          <ActionButton
            onClick={(event) =>
              event.target.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Escape' })
              )
            }
            icon={X}
            label={t(SIMPLE_WORDS.CLOSE)}
          />
        </Popover.Dropdown>
      </Popover>
      {/* <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        strike
      </button> */}
    </TipTapFloatingMenu>
  );
};
