import { Node, mergeAttributes } from '@tiptap/core';

export const Column = Node.create({
  name: 'column',
  group: 'column',
  content: '(paragraph|block)*',
  isolating: true,
  selectable: false,

  addKeyboardShortcuts() {
    return {
      'Shift-Enter': (props) => {
        if (this.editor.isActive(this.name)) {
          console.log(
            this.editor.state.selection.anchor,
            this.editor.state.selection.anchor + 2,
            this.editor.state.doc.content.size
          );

          return this.editor.commands.setNodeSelection(
            this.editor.state.selection.anchor + 1
          );
          // return props.editor.commands.focus('end');
        }

        return true;
      },
    };
  },

  parseHTML() {
    return [
      {
        attrs: {
          'data-layout-column': 'true',
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = mergeAttributes(HTMLAttributes, {
      class: 'overflow-auto border border-gray-400 rounded p-4',
      'data-layout-column': 'true',
    });

    return ['div', attrs, 0];
  },
});
