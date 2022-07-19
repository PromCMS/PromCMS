import { API, BlockTool } from '@editorjs/editorjs';
import * as iconSet from 'tabler-icons-react';
import { ItemID } from '@prom-cms/shared';
import ReactDom from 'react-dom';
import { ButtonLinkView } from './ButtonLinkView';
export interface ButtonLinkToolData {
  linkTo: string;
  label?: string;
  icon?: keyof typeof iconSet;
  isDownload?: boolean;
  openOnNewTab?: boolean;
  placeholderImage?: ItemID;
}

type Setting = {
  name: 'withBorder' | 'stretched' | 'changeImage';
  icon: string;
};

type Nodes = {
  holder: HTMLDivElement | null;
  reactElement: HTMLDivElement | null;
  inputElement: HTMLInputElement | null;
};

/**
 * ImageTool for the Editor.js
 */
class ButtonLinkTool implements BlockTool {
  api: API;
  readOnly: boolean;
  blockIndex: number;
  CSS: Record<string, string>;
  nodes: Nodes;
  settings: Setting[];
  data: ButtonLinkToolData;

  static get isReadOnlySupported() {
    return true;
  }

  static get toolbox() {
    return {
      title: 'Button Link',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-link" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5" /><path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5" /></svg>',
    };
  }

  constructor({ data, api, readOnly }: any) {
    this.api = api;
    this.readOnly = readOnly;
    this.blockIndex = this.api.blocks.getCurrentBlockIndex() + 1;

    this.data = {
      linkTo: '',
      ...data,
    };

    this.CSS = {
      wrapper: 'button-link-tool my-5',
      input: 'hidden',
    };

    this.nodes = {
      holder: null,
      inputElement: null,
      reactElement: null,
    };
  }

  render() {
    const holder = document.createElement('div');
    const inputElement = document.createElement('input');
    const rootElement = document.createElement('div');

    // Take care of css
    holder.setAttribute('class', this.CSS.wrapper);
    inputElement.setAttribute('class', this.CSS.input);

    // Attach elements
    holder.appendChild(inputElement);
    holder.appendChild(rootElement);

    // Cache elements
    this.nodes.inputElement = inputElement;
    this.nodes.reactElement = rootElement;
    this.nodes.holder = holder;

    // On data change from react
    const onDataChange = async (newData) => {
      if (this.readOnly) return;
      this.data = Object.assign(this.data, newData);
      // Also update input element
      if (this.nodes.inputElement) {
        this.nodes.inputElement.value = JSON.stringify(this.data);
        this.nodes.inputElement.dispatchEvent(new Event('change'));
      }
    };

    // Render react controller
    ReactDom.render(
      <ButtonLinkView
        dataFromParent={this.data}
        onDataChange={onDataChange}
        readOnly={this.readOnly}
      />,
      this.nodes.reactElement
    );

    return this.nodes.holder;
  }

  validate() {
    if (!this.data.linkTo || !/^((https|http):\/\/).*/.test(this.data.linkTo)) {
      return false;
    }

    return true;
  }

  save() {
    return { ...this.data };
  }
}

export default ButtonLinkTool;
