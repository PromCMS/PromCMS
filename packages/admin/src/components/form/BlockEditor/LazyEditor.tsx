import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import EditorJS, { EditorConfig } from '@editorjs/editorjs'
import Table from '@editorjs/table'
import Underline from '@editorjs/underline'
import Marker from '@editorjs/marker'
import ImageTool from '@editorjs/image'
import List from '@editorjs/list'
import Tooltip from 'editorjs-tooltip'
import ChangeCase from 'editorjs-change-case'
import Header from '@editorjs/header'
import AlignmentTool from 'editorjs-text-alignment-blocktune'
import ParagraphTool from '@editorjs/paragraph'

export const EDITOR_HOLDER_ID = 'editor-content'

export interface LazyEditorProps
  extends Omit<EditorConfig, 'holder' | 'tools'> {
  initialValue?: EditorConfig['data']
}

export const LazyEditor = forwardRef<EditorJS | undefined, LazyEditorProps>(
  function LazyEditor({ initialValue, ...config }, ref) {
    const innerRef = useRef<EditorJS>()

    useImperativeHandle(ref, () => innerRef.current)

    useEffect(() => {
      const editorInstance = new EditorJS({
        /**
         * Create a holder for the Editor and pass its ID
         */
        holder: EDITOR_HOLDER_ID,
        tools: {
          header: Header,
          table: Table,
          underline: Underline,
          Marker: {
            class: Marker,
            shortcut: 'CMD+SHIFT+M',
          },
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
                byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
              },
            },
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
          },
        },
        data: initialValue,
        ...config,
      })

      innerRef.current = editorInstance

      return () => {
        if (innerRef.current?.destroy) {
          innerRef.current?.destroy()
        }
      }
    }, [])

    return <div id={EDITOR_HOLDER_ID} />
  }
)
