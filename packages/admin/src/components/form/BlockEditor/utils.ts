import type { EditorConfig } from '@editorjs/editorjs';
import { LayoutBlockTool } from 'editorjs-layout';
import { TFunction } from 'react-i18next';
import EditorJS from '@editorjs/editorjs';

type GenerateLayoutConfigProps = {
  numberOfCols: number;
  editorJSConfig: EditorConfig;
  t: TFunction<'translation', undefined>;
};

export const generateLayoutConfig = ({
  numberOfCols,
  editorJSConfig,
  t,
}: GenerateLayoutConfigProps) => {
  const iterativeArray = new Array(numberOfCols).fill(true);

  return {
    class: LayoutBlockTool as any,
    config: {
      EditorJS,
      editorJSConfig,
      enableLayoutEditing: true,
      enableLayoutSaving: true,
      initialData: {
        itemContent: Object.fromEntries(
          iterativeArray.map((_, id) => [
            id,
            {
              blocks: [],
            },
          ])
        ),
        layout: {
          type: 'container',
          id: '',
          className: 'editor-js__layout__wrap',
          children: iterativeArray.map((_, id) => ({
            type: 'item',
            id: String(id),
            className: 'editor-js__layout__item',
            itemContentId: String(id),
          })),
        },
      },
    },
    shortcut: 'CMD+2',
    toolbox: {
      icon: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" class="icon icon-tabler icon-tabler-layout-board" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M4 9h8" />
          <path d="M12 15h8" />
          <path d="M12 4v16" />
        </svg>
      `,
      title: `${iterativeArray.length} ${t('Columns')}`,
    },
  };
};
