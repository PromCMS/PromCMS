import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import clsx from 'clsx';
import { TextSelection } from 'prosemirror-state';

import { Column } from './ColumnNode';
import { LayoutNodeView } from './LayoutNodeView';
import { createLayout } from './utils';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    layout: {
      setColumns: (columns: number) => ReturnType;
      insertColumns: (columns: number) => ReturnType;
      unsetColumns: () => ReturnType;
      addLayout: (opts?: { size?: number }) => ReturnType;
    };
  }
}

export interface LayoutNodeOptions {
  nestedColumns: boolean;
  columnType: Node;
}

export const LayoutNode = Node.create<LayoutNodeOptions>({
  name: 'layout',
  group: 'block',
  content: 'column{2,}',
  isolating: true,
  selectable: true,

  addOptions() {
    return {
      nestedColumns: false,
      columnType: Column,
    };
  },

  parseHTML() {
    return [
      {
        attrs: {
          'data-layout-root': String(true),
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = mergeAttributes(HTMLAttributes, {
      'data-layout-root': String(true),
    });

    return ['div', attrs, 0];
  },

  addCommands() {
    return {
      addLayout:
        (options = {}) =>
        ({ dispatch, tr }) => {
          const { size } = { ...options, size: 2 };
          const node = createLayout(this.editor.schema, size);

          if (dispatch) {
            const offset = tr.selection.anchor + 1;
            tr.replaceSelectionWith(node)
              .scrollIntoView()
              .setSelection(TextSelection.near(tr.doc.resolve(offset)));
          }

          return true;
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(LayoutNodeView, { className: 'is-root' });
  },
});
