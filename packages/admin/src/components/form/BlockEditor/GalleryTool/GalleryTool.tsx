import { API, BlockTool } from '@editorjs/editorjs'
import { ItemID } from '@prom-cms/shared'
import ReactDom from 'react-dom'
import { ImageToolView } from './GalleryToolView'

export interface GalleryToolData {
  fileIds?: ItemID[]
  label?: string
}

type Setting = {
  name: 'withBorder' | 'stretched' | 'changeImage'
  icon: string
}

/**
 * ImageTool for the Editor.js
 */
class GalleryTool implements BlockTool {
  api: API
  readOnly: boolean
  blockIndex: number
  CSS: Record<string, string>
  nodes: {
    holder: HTMLDivElement | null
    reactElement: HTMLDivElement | null
    inputElement: HTMLInputElement | null
  }
  settings: Setting[]
  data: GalleryToolData

  static get isReadOnlySupported() {
    return true
  }

  static get toolbox() {
    return {
      title: 'Gallery',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-polaroid" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="4" y="4" width="16" height="16" rx="2" /><line x1="4" y1="16" x2="20" y2="16" /><path d="M4 12l3 -3c.928 -.893 2.072 -.893 3 0l4 4" /><path d="M13 12l2 -2c.928 -.893 2.072 -.893 3 0l2 2" /><line x1="14" y1="7" x2="14.01" y2="7" /></svg>',
    }
  }

  constructor({ data, api, readOnly }: any) {
    this.api = api
    this.readOnly = readOnly
    this.blockIndex = this.api.blocks.getCurrentBlockIndex() + 1
    this.data = {
      fileIds: data.fileIds || [],
      label: data.label,
    }

    this.CSS = {
      wrapper: 'image-tool',
      input: 'hidden',
    }

    this.nodes = {
      holder: null,
      inputElement: null,
      reactElement: null,
    }
  }

  render() {
    const holder = document.createElement('div')
    const inputElement = document.createElement('input')
    const rootElement = document.createElement('div')

    // Take care of css
    holder.setAttribute('class', this.CSS.wrapper)
    inputElement.setAttribute('class', this.CSS.input)

    // Attach elements
    holder.appendChild(inputElement)
    holder.appendChild(rootElement)

    // Cache elements
    this.nodes.inputElement = inputElement
    this.nodes.reactElement = rootElement
    this.nodes.holder = holder

    // On data change from react
    const onDataChange = async (newData) => {
      if (this.readOnly) return
      this.data = Object.assign(this.data, newData)
      // Also update input element
      if (this.nodes.inputElement) {
        this.nodes.inputElement.value = JSON.stringify(this.data)
        this.nodes.inputElement.dispatchEvent(new Event('change'))
      }
    }

    // Render react controller
    ReactDom.render(
      <ImageToolView
        data={this.data}
        onDataChange={onDataChange}
        readOnly={this.readOnly}
      />,
      this.nodes.reactElement
    )

    return this.nodes.holder
  }

  validate() {
    if (this.data.fileIds && this.data.fileIds.length) {
      return true
    }

    return false
  }

  save() {
    return { ...this.data }
  }
}

export default GalleryTool
