import type { API, BlockTool } from '@editorjs/editorjs';
import { ItemID } from '@prom-cms/shared';
import ReactDom from 'react-dom/client';
import { ImageToolView } from './ImageToolView';

export interface ImageToolData {
  fileId?: ItemID;
  label?: string;
  description?: string;
}

type Setting = {
  name: 'withBorder' | 'stretched' | 'changeImage';
  icon: string;
};

/**
 * ImageTool for the Editor.js
 */
class ImageTool implements BlockTool {
  api: API;
  readOnly: boolean;
  blockIndex: number;
  CSS: Record<string, string>;
  root: ReactDom.Root;
  nodes: {
    holder: HTMLDivElement | null;
    reactElement: HTMLDivElement | null;
    inputElement: HTMLInputElement | null;
  };
  settings: Setting[];
  data: ImageToolData;

  static get isReadOnlySupported() {
    return true;
  }

  static get toolbox() {
    return {
      title: 'Image',
      icon: '<svg width="17" height="15" style="width:16px" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
    };
  }

  constructor({ data, api, readOnly }: any) {
    this.api = api;
    this.readOnly = readOnly;
    this.blockIndex = this.api.blocks.getCurrentBlockIndex() + 1;
    this.data = {
      fileId: data.fileId || '',
      label: data.label,
    };

    this.CSS = {
      wrapper: 'image-tool my-5',
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
    this.root = ReactDom.createRoot(this.nodes.reactElement!);
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

    this.root.render(
      <ImageToolView
        data={this.data}
        onDataChange={onDataChange}
        readOnly={this.readOnly}
      />
    );

    return this.nodes.holder;
  }

  validate() {
    if (!!this.data.fileId) {
      return true;
    }

    return false;
  }

  save(): ImageToolData {
    return { ...this.data };
  }

  removed(): void {
    this.root?.unmount();
  }
}

export default ImageTool;
