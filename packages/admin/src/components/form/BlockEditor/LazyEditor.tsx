import { FC, useEffect, useRef, useState } from 'react';
import EditorJS, { EditorConfig, LogLevels } from '@editorjs/editorjs';
import Table from '@editorjs/table';
import Underline from '@editorjs/underline';
import Marker from '@editorjs/marker';
import List from '@editorjs/list';
import ChangeCase from 'editorjs-change-case';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import AlignmentTool from 'editorjs-text-alignment-blocktune';
import ParagraphTool from '@editorjs/paragraph';
import { ImageTool } from './ImageTool';
import { generateLayoutConfig } from './utils';
import { useTranslation } from 'react-i18next';
import { GalleryTool } from './GalleryTool';
import Embed from '@editorjs/embed';
import { ButtonLinkTool } from './ButtonLink';
import { TagsTool } from './TagsTool';
import { LinkInlineTool } from './LinkInlineTool';
import { DynamicBlockTool } from './DynamicBlockTool';
import { useBlockEditorRefs } from '@contexts/BlockEditorContext';

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
        },
        link: { class: LinkInlineTool, inlineToolbar: true },
        table: { class: Table, inlineToolbar: true },
        underline: Underline,
        Marker: Marker,
        embed: Embed,
        buttonLink: ButtonLinkTool,
        tags: TagsTool,
        image: ImageTool,
        gallery: GalleryTool,
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
          },
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: "Quote's author",
          },
        },
        changeCase: {
          class: ChangeCase,
          inlineToolbar: true,
          config: {
            showLocaleOption: true, // enable locale case options
            locale: 'tr', // or ['tr', 'TR', 'tr-TR']
          },
        },
        anyTuneName: {
          class: AlignmentTool,
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
