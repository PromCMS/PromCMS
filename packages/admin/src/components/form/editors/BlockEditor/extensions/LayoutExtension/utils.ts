import type { JSONContent } from '@tiptap/core';
import { Column } from './ColumnNode';
import type {
  Fragment,
  Node,
  NodeType,
  ResolvedPos,
  Schema,
} from 'prosemirror-model';
import { LayoutNode } from './LayoutNode';

const times = <T>(n: number, fn: (i: number) => T): T[] =>
  Array.from({ length: n }, (_, i) => fn(i));

export const buildNode = ({ type, content }: JSONContent): JSONContent =>
  content ? { type, content } : { type };

export const buildParagraph = ({ content }: Partial<JSONContent>) =>
  buildNode({ type: 'paragraph', content });

export const buildColumn = ({ content }: Partial<JSONContent>) =>
  buildNode({ type: 'column', content });

export const buildColumnBlock = ({ content }: Partial<JSONContent>) =>
  buildNode({ type: 'columnBlock', content });

export const buildNColumns = (n: number) => {
  const content = [buildParagraph({})];
  const fn = () => buildColumn({ content });
  return times(n, fn);
};

interface PredicateProps {
  node: Node;
  pos: number;
  start: number;
}

export type Predicate = (props: PredicateProps) => boolean;

export const findParentNodeClosestToPos = (
  $pos: ResolvedPos,
  predicate: Predicate
) => {
  for (let i = $pos.depth; i > 0; i--) {
    const node = $pos.node(i);
    const pos = i > 0 ? $pos.before(i) : 0;
    const start = $pos.start(i);
    if (predicate({ node, pos, start })) {
      return {
        start,
        depth: i,
        node,
        pos,
      };
    }
  }
  throw Error('no ancestor found');
};

function createLayoutColumn(
  cellType: NodeType,
  cellContent?: Fragment | Node | Array<Node>
): Node | null | undefined {
  if (cellContent) {
    return cellType.createChecked(null, cellContent);
  }

  return cellType.createAndFill();
}

export function createLayout(
  schema: Schema,
  colsCount: number,
  colsContent?: Fragment | Node | Array<Node>
): Node {
  const columns: Node[] = [];

  for (let index = 0; index < colsCount; index += 1) {
    const cell = createLayoutColumn(schema.nodes[Column.name], colsContent);

    if (cell) {
      columns.push(cell);
    }
  }

  return schema.nodes[LayoutNode.name].createChecked(null, columns);
}
