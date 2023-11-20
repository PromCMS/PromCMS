import { ReactNodeViewRenderer } from '@tiptap/react';
import { Attribute, mergeAttributes, Node } from '@tiptap/core';
import { ImageNodeView } from './ImageNodeView';
import { NodeAttrs } from './_types';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      addImage: () => ReturnType;
    };
  }
}

export const ImageNode = Node.create({
  name: 'image',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes(): Record<keyof NodeAttrs, Attribute> {
    return {
      fileId: {
        default: '',
        keepOnSplit: false,
      },
      metadata: { default: {}, keepOnSplit: false },
    };
  },

  parseHTML() {
    return [{ tag: 'img' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes({ ...HTMLAttributes }), 0];
  },

  addCommands() {
    return {
      addImage:
        () =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.type.name,
            })
            .run();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
