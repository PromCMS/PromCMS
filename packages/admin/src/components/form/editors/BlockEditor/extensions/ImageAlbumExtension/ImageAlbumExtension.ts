import { Extension, Node } from '@tiptap/core';
import { ImageAlbumNode } from './ImageAlbumNode/ImageAlbumNode';

export interface ImageAlbumExtensionOptions {
  imageAlbum?: boolean;
}

export const ImageAlbumExtension = Extension.create<ImageAlbumExtensionOptions>(
  {
    name: 'imageAlbumExtension',

    addExtensions() {
      const extensions: Node[] = [];

      if (this.options.imageAlbum !== false) {
        extensions.push(ImageAlbumNode);
      }

      return extensions;
    },
  }
);
