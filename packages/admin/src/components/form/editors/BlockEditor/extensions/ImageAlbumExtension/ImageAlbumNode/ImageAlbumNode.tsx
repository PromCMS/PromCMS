import { ReactNodeViewRenderer } from '@tiptap/react';
import { mergeAttributes, Node } from '@tiptap/core';
import { ImageAlbumNodeView } from './ImageAlbumNodeView';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageAlbum: {
      addAlbum: () => ReturnType;
      setAlbumColumns: (numberOfColumns: number) => ReturnType;
    };
  }
}

export const ImageAlbumNode = Node.create({
  name: 'imageAlbum',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      numberOfColumns: {
        default: 5,
      },
      images: {
        default: [],
      },
    };
  },

  parseHTML() {
    return [{ attrs: { 'data-image-album': true } }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes({ ...HTMLAttributes, 'data-image-album': String(true) }),
      0,
    ];
  },

  addCommands() {
    return {
      addAlbum:
        () =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.type.name,
            })
            .run();
        },
      setAlbumColumns:
        (numberOfColumns: number) =>
        ({ chain }) => {
          return chain()
            .focus()
            .updateAttributes('imageAlbum', { numberOfColumns })
            .run();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageAlbumNodeView);
  },
});
