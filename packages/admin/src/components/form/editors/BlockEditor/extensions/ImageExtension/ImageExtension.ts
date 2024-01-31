import { Extension, Node } from '@tiptap/core';

import { ImageNode } from './ImageNode';

export interface ImageExtensionOptions {}

export const ImageExtension = Extension.create<ImageExtensionOptions>({
  name: 'imageExtension',

  addExtensions() {
    const extensions: Node[] = [];

    extensions.push(ImageNode);

    return extensions;
  },
});
