import EditorJS, { EditorConfig, LogLevels } from '@editorjs/editorjs';
import Embed from '@editorjs/embed';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
import ParagraphTool from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import Underline from '@editorjs/underline';
import { useBlockEditorRefs } from 'contexts/BlockEditorContext';
import ChangeCase from 'editorjs-change-case';
import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AlignmentTool from './AlignmentTool';
import { ButtonLinkTool } from './ButtonLink';
import { DynamicBlockTool } from './DynamicBlockTool';
import { GalleryTool } from './GalleryTool';
import { ImageTool } from './ImageTool';
import { LinkInlineTool } from './LinkInlineTool';
import { TagsTool } from './TagsTool';
import { generateLayoutConfig } from './utils';

export const EDITOR_HOLDER_ID = 'editor-content';

export interface LazyEditorProps
  extends Omit<EditorConfig, 'holder' | 'tools'> {
  initialValue?: EditorConfig['data'];
  error?: string;
  className?: string;
  name: string;
}

export const LazyEditor: FC<LazyEditorProps> = ({
  initialValue,
  error,
  className,
  name,
  ...config
}) => {
  const blockEditorRefs = useBlockEditorRefs();
  const ref = useRef<EditorJS>();
  const [editorReady, setEditorReady] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const editorConfig: EditorConfig = {
      /**
       * Create a holder for the Editor and pass its ID
       */
      holder: EDITOR_HOLDER_ID,
      logLevel: 'ERROR' as LogLevels.ERROR,
      placeholder: t('Start typing here...') as string,
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            placeholder: t('Start typing here...'),
            levels: [2, 3, 4],
            defaultLevel: 2,
          },
          tunes: ['alignmentTool'],
        },
        link: { class: LinkInlineTool, inlineToolbar: true },
        table: { class: Table, inlineToolbar: true },
        underline: Underline,
        Marker: Marker,
        embed: Embed,
        buttonLink: {
          class: ButtonLinkTool,
          tunes: ['alignmentTool'],
        },
        tags: {
          class: TagsTool,
          tunes: ['alignmentTool'],
        },
        image: ImageTool,
        gallery: GalleryTool,
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
          },
          tunes: ['alignmentTool'],
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: t('Enter a quote'),
            captionPlaceholder: t("Quote's author"),
          },
        },
        changeCase: {
          class: ChangeCase,
          inlineToolbar: true,
          config: {
            showLocaleOption: true, // enable locale case options
            locale: 'en', // or ['tr', 'TR', 'tr-TR']
          },
        },
        alignmentTool: {
          class: AlignmentTool as any,
          config: {
            default: 'left',
            blocks: {
              header: 'left',
              list: 'left',
            },
          },
        },
        dynamicBlock: DynamicBlockTool,
        paragraph: {
          class: ParagraphTool,
          inlineToolbar: true,
          config: {
            placeholder: t('Start typing here...'),
          },
          tunes: ['alignmentTool'],
        },
      },
      inlineToolbar: true,
      onReady: () => {
        if (config.onReady) config.onReady();
        setEditorReady(true);
      },
      ...config,
    };

    // Remove custom listeners that should be in main editor
    const { onChange, onReady, ...layoutEditorConfig } = editorConfig;

    const editorConfigWithLayouts = {
      ...editorConfig,
      tools: {
        ...editorConfig.tools,
        columns: generateLayoutConfig({
          editorJSConfig: layoutEditorConfig,
          t,
        }),
      },
    };

    const editorInstance = new EditorJS(editorConfigWithLayouts);

    ref.current = editorInstance;
    blockEditorRefs.add(name, ref.current);

    return () => {
      if (ref.current?.destroy) {
        ref.current?.destroy();
        blockEditorRefs.remove(name);
      }
    };
  }, [t, name]);

  useEffect(() => {
    if (ref.current && initialValue && 'render' in ref.current && editorReady) {
      const value =
        typeof initialValue == 'string'
          ? JSON.parse(initialValue)
          : JSON.parse(JSON.stringify(initialValue || {}));

      if (value.blocks && !!value.blocks.length) {
        ref.current.render(value);
      }
    }
  }, [editorReady]);

  return (
    <div className={className}>
      {error && <small className="font-bold text-red-500">{error}</small>}
      <div id={EDITOR_HOLDER_ID} />
    </div>
  );
};

export default LazyEditor;
