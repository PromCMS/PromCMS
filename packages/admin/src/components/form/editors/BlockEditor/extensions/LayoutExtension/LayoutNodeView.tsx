import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { FC } from 'react';

export const LayoutNodeView: FC = () => {
  return (
    <NodeViewWrapper>
      <NodeViewContent className="data-layout-root" />
    </NodeViewWrapper>
  );
};
