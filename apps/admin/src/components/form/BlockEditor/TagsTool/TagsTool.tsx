import type { API, BlockTool } from '@editorjs/editorjs';
import ReactDom from 'react-dom/client';
import { TagsToolView } from './TagsToolView';

export interface TagsToolData {
  tags: string[];
}

type Setting = {
  name: 'withBorder' | 'stretched' | 'changeImage';
  icon: string;
};

/**
 * TagsTool for the Editor.js
 */
class TagsTool implements BlockTool {
  api: API;
  readOnly: boolean;
  blockIndex: number;
  CSS: Record<string, string>;
  nodes: {
    holder: HTMLDivElement | null;
    reactElement: HTMLDivElement | null;
    inputElement: HTMLInputElement | null;
  };
  settings: Setting[];
  data: TagsToolData;

  static get isReadOnlySupported() {
    return true;
  }

  static get toolbox() {
    return {
      title: 'Tags',
      icon: `
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-tags" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M7.859 6h-2.834a2.025 2.025 0 0 0 -2.025 2.025v2.834c0 .537 .213 1.052 .593 1.432l6.116 6.116a2.025 2.025 0 0 0 2.864 0l2.834 -2.834a2.025 2.025 0 0 0 0 -2.864l-6.117 -6.116a2.025 2.025 0 0 0 -1.431 -.593z" />
          <path d="M17.573 18.407l2.834 -2.834a2.025 2.025 0 0 0 0 -2.864l-7.117 -7.116" />
          <path d="M6 9h-.01" />
        </svg>
      `,
    };
  }

  constructor({ data, api, readOnly }: any) {
    this.api = api;
    this.readOnly = readOnly;
    this.blockIndex = this.api.blocks.getCurrentBlockIndex() + 1;
    this.data = {
      tags: data.tags ?? [],
    };

    this.CSS = {
      wrapper: 'tags-tool my-5',
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
    ReactDom.createRoot(this.nodes.reactElement!).render(
      <TagsToolView
        dataFromParent={this.data}
        onDataChange={onDataChange}
        readOnly={this.readOnly}
      />
    );

    return this.nodes.holder;
  }

  validate() {
    if (!!this.data.tags && !!this.data.tags.length) {
      return true;
    }

    return false;
  }

  save() {
    return { ...this.data };
  }
}

export default TagsTool;
