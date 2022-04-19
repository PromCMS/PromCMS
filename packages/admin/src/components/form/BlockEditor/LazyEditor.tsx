import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import EditorJS, { EditorConfig, LogLevels } from '@editorjs/editorjs'
import Table from '@editorjs/table'
import Underline from '@editorjs/underline'
import Marker from '@editorjs/marker'
import List from '@editorjs/list'
import Tooltip from 'editorjs-tooltip'
import ChangeCase from 'editorjs-change-case'
import Header from '@editorjs/header'
import AlignmentTool from 'editorjs-text-alignment-blocktune'
import ParagraphTool from '@editorjs/paragraph'
import { ImageTool } from './ImageTool'
import { generateLayoutConfig } from './utils'
import { useTranslation } from 'react-i18next'
import { GalleryTool } from './GalleryTool'
import Embed from '@editorjs/embed'
import { ButtonLinkTool } from './ButtonLink'

export const EDITOR_HOLDER_ID = 'editor-content'

export interface LazyEditorProps
  extends Omit<EditorConfig, 'holder' | 'tools'> {
  initialValue?: EditorConfig['data']
  editorRef?: Ref<EditorJS | undefined>
}

export const LazyEditor = forwardRef<EditorJS | undefined, LazyEditorProps>(
  function LazyEditor({ initialValue, editorRef, ...config }, ref) {
    const innerRef = useRef<EditorJS>()
    const [editorReady, setEditorReady] = useState(false)
    const { t } = useTranslation()

    useImperativeHandle(editorRef, () => innerRef.current)

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
            config: {
              placeholder: t('Start typing here...'),
              levels: [2, 3, 4],
              defaultLevel: 2,
            },
          },
          table: Table,
          underline: Underline,
          Marker: {
            class: Marker,
          },
          embed: {
            class: Embed,
          },
          buttonLink: {
            class: ButtonLinkTool,
          },
          image: {
            class: ImageTool,
            inlineToolbar: true,
          },
          gallery: {
            class: GalleryTool,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered',
            },
          },
          changeCase: {
            class: ChangeCase,
            config: {
              showLocaleOption: true, // enable locale case options
              locale: 'tr', // or ['tr', 'TR', 'tr-TR']
            },
          },
          tooltip: {
            class: Tooltip,
            config: {
              location: 'left',
              highlightColor: '#FFEFD5',
              underline: true,
              backgroundColor: '#154360',
              textColor: '#FDFEFE',
              holder: EDITOR_HOLDER_ID,
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
          if (config.onReady) config.onReady()
          setEditorReady(true)
        },
        ...config,
      }

      const editorConfigWithLayouts = {
        ...editorConfig,
        tools: {
          ...editorConfig.tools,
          columns: generateLayoutConfig({
            numberOfCols: 4,
            editorJSConfig: editorConfig,
            t,
          }),
        },
      }

      const editorInstance = new EditorJS(editorConfigWithLayouts)

      innerRef.current = editorInstance

      return () => {
        if (innerRef.current?.destroy) {
          innerRef.current?.destroy()
        }
      }
    }, [t])

    useEffect(() => {
      if (
        innerRef.current &&
        initialValue &&
        innerRef.current.render &&
        editorReady
      ) {
        const value =
          typeof initialValue == 'string'
            ? JSON.parse(initialValue)
            : JSON.parse(JSON.stringify(initialValue || {}))

        innerRef.current.render(value)
      }
    }, [editorReady, initialValue])

    return <div id={EDITOR_HOLDER_ID} />
  }
)
