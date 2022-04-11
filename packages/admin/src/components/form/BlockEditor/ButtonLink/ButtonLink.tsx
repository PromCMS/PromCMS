import { API, BlockTool } from '@editorjs/editorjs'
import { iconSet } from '@prom-cms/icons'
import { t } from 'i18next'
import { HTMLAttributes } from 'react'
import ReactDOM from 'react-dom'

export interface ImageToolData {
  linkTo: string
  text: string
  icon?: keyof typeof iconSet
}

type Setting = {
  name: 'withBorder' | 'stretched' | 'changeImage'
  icon: string
}

type Nodes = {
  holder: any
  linkToInput: any | HTMLInputElement
  labelInput: any | HTMLInputElement
  iconSelector: any | HTMLDivElement
  readOnlyButton: any | HTMLButtonElement
}

/**
 * ImageTool for the Editor.js
 */
class ButtonLinkTool implements BlockTool {
  api: API
  readOnly: boolean
  blockIndex: number
  CSS: Record<string, string>
  nodes: Nodes
  settings: Setting[]
  data: ImageToolData

  static get isReadOnlySupported() {
    return true
  }

  static get toolbox() {
    return {
      title: 'Button Link',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-hash" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="5" y1="9" x2="19" y2="9" /><line x1="5" y1="15" x2="19" y2="15" /><line x1="11" y1="4" x2="7" y2="20" /><line x1="17" y1="4" x2="13" y2="20" /></svg>',
    }
  }

  constructor({ data, api, readOnly }: any) {
    this.api = api
    this.readOnly = readOnly
    this.blockIndex = this.api.blocks.getCurrentBlockIndex() + 1
    this.data = {
      linkTo: data.linkTo || '',
      text: data.text || '',
      icon: data.icon,
    }

    this.CSS = {
      wrapper: 'button-link-tool',
      linkToInput: 'button-link-tool__linkto-input',
      labelInput: 'button-link-tool__label-input',
      iconSelector: 'button-link-tool__icon-selector',
      readOnlyButton: 'button-link-tool__readonly__button',
      title: 'button-link-tool__title',
      inputLabel: 'button-link-tool__input__label',
    }

    this.nodes = {
      holder: null,
      iconSelector: null,
      labelInput: null,
      linkToInput: null,
      readOnlyButton: null,
    }
  }

  render() {
    const title = this._createEl({
      tagName: 'p',
      classList: [this.CSS.title],
      children: ['Button Link'],
    })

    const finalChildren: HTMLElement[] = [title]

    if (this.readOnly) {
      const icon = this._createEl({
        tagName: 'div',
        classList: [],
      })
      if (this.data.icon) {
        const ReactIcon = iconSet[this.data.icon]
        ReactDOM.render(<ReactIcon />, icon)
      }

      const readOnlyButton = this._createEl({
        cacheKey: 'readOnlyButton',
        tagName: 'div',
        classList: [this.CSS.readOnlyButton],
        children: [this.data.text || this.data.linkTo],
      })

      finalChildren.push(readOnlyButton)
    } else {
      const linkToInputLabel = this._createEl({
        tagName: 'label',
        classList: [this.CSS.inputLabel],
        children: [t('Link to')],
      })
      const linkToInput = this._createEl({
        cacheKey: 'linkToInput',
        tagName: 'input',
        classList: [this.CSS.linkToInput],
        attributes: {
          placeholder: t('Start typing here...'),
        },
      })

      const labelInputLabel = this._createEl({
        tagName: 'label',
        classList: [this.CSS.inputLabel],
        children: [t('Link text')],
      })
      const labelInput = this._createEl({
        cacheKey: 'labelInput',
        tagName: 'input',
        classList: [this.CSS.labelInput],
        attributes: {
          placeholder: t('Start typing here...'),
        },
      })

      finalChildren.push(
        linkToInputLabel,
        linkToInput,
        labelInputLabel,
        labelInput
      )
    }

    const holder = this._createEl({
      cacheKey: 'holder',
      tagName: 'div',
      classList: [this.CSS.wrapper, this.readOnly && 'readOnly'].filter(
        (className) => !!className
      ) as string[],
      children: finalChildren,
    })

    return holder
  }

  _createEl<T extends keyof HTMLElementTagNameMap>({
    cacheKey,
    tagName,
    classList,
    children,
    attributes,
  }: {
    cacheKey?: keyof Nodes
    tagName: T
    classList: string[]
    children?: (HTMLElementTagNameMap[keyof HTMLElementTagNameMap] | string)[]
    attributes?: HTMLAttributes<HTMLElementTagNameMap[T]>
  }) {
    const item = document.createElement(tagName)

    for (const attrKey in attributes) {
      item.setAttribute(attrKey, (attributes as any)[attrKey])
    }

    for (const className of classList) {
      item.classList.add(className)
    }

    if (children) {
      item.append(...children)
    }

    if (cacheKey) {
      this.nodes[cacheKey] = item
    }

    return item
  }

  validate() {
    if (!this.data.linkTo || this.data.text) {
      return false
    }

    return true
  }

  save(): ImageToolData {
    return { ...this.data }
  }
}

export default ButtonLinkTool
