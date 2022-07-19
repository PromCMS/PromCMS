import { API, BlockTool } from '@editorjs/editorjs';
import ReactDom from 'react-dom';
import { DynamicBlockToolView } from './DynamicBlockToolView';

export interface DynamicBlockToolData {
  blockId: string;
}

/**
 * DynamicBlockTool for the Editor.js
 */
class DynamicBlockTool implements BlockTool {
  api: API;
  readOnly: boolean;
  blockIndex: number;
  CSS: Record<string, string>;
  nodes: {
    holder: HTMLDivElement | null;
    reactElement: HTMLDivElement | null;
    inputElement: HTMLInputElement | null;
  };
  data: DynamicBlockToolData;

  static get isReadOnlySupported() {
    return true;
  }

  static get toolbox() {
    return {
      title: 'Dynamic block',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brackets" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 4h-3v16h3" /><path d="M16 4h3v16h-3" /></svg>',
    };
  }

  constructor({ data, api, readOnly }: any) {
    this.api = api;
    this.readOnly = readOnly;
    this.blockIndex = this.api.blocks.getCurrentBlockIndex() + 1;
    this.data = {
      blockId: data.blockId,
    };

    this.CSS = {
      wrapper: 'dynamic-block-tool my-5',
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
      <DynamicBlockToolView
        data={this.data}
        onDataChange={onDataChange}
        readOnly={this.readOnly}
      />,
      this.nodes.reactElement
    );

    return this.nodes.holder;
  }

  validate() {
    if (this.data.blockId && this.data.blockId.length) {
      return true;
    }

    return false;
  }

  save() {
    return { ...this.data };
  }
}

export default DynamicBlockTool;
