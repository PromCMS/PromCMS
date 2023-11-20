import { Extension, Node } from '@tiptap/core';
import { Column } from './ColumnNode';
import { LayoutNode } from './LayoutNode';

export interface LayoutExtensionOptions {
  column?: boolean;
  columnBlock?: boolean;
}

export const LayoutExtension = Extension.create<LayoutExtensionOptions>({
  name: 'layoutExtension',

  addExtensions() {
    const extensions: Node[] = [];

    if (this.options.column !== false) {
      extensions.push(Column);
    }

    if (this.options.columnBlock !== false) {
      extensions.push(LayoutNode);
    }

    return extensions;
  },
});
