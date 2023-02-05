import type EditorJS from '@editorjs/editorjs';
import type {
  BlockAPI,
  BlockTool,
  BlockToolConstructorOptions,
  EditorConfig,
} from '@editorjs/editorjs';
import { renderContainer } from './container';
import type {
  LayoutBlockContainerData,
  ValidatedLayoutBlockContainerData,
} from './container';
import type {
  LayoutBlockItemContentData,
  ValidatedLayoutBlockItemContentData,
} from './itemContent';
import { TunesMenuConfigItem } from '@editorjs/editorjs/types/tools';
import { t } from 'i18next';

interface LayoutBlockToolConfig {
  EditorJS: typeof EditorJS;
  editorJSConfig: Omit<
    EditorConfig,
    'holder' | 'data' | 'minHeight' | 'readOnly'
  >;
  /** Reserved flag for the future */
  enableLayoutEditing: false;
  enableLayoutSaving: boolean;
  initialData: ValidatedLayoutBlockToolData;
}

interface LayoutBlockToolData {
  itemContent: LayoutBlockItemContentData;
  layout?: LayoutBlockContainerData;
}

interface ValidatedLayoutBlockToolData extends LayoutBlockToolData {
  itemContent: ValidatedLayoutBlockItemContentData;
  layout?: ValidatedLayoutBlockContainerData;
}

interface LayoutBlockToolDispatchData {
  (
    action: (prevData: {
      itemContent: LayoutBlockItemContentData;
      layout: LayoutBlockContainerData;
    }) => {
      itemContent: LayoutBlockItemContentData;
      layout: LayoutBlockContainerData;
    }
  ): void;
}

const sliceObject = <T extends Record<string, any>>(
  obj: T,
  from?: number,
  to?: number
) => Object.fromEntries(Object.entries(obj).slice(from, to));

/**
 * Layout block tool - copied from https://www.npmjs.com/package/editorjs-layout, all credits to creator
 */
class LayoutBlockTool implements BlockTool {
  static get isReadOnlySupported() {
    return true;
  }

  static get toolbox() {
    return {
      icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512">
          <rect x="48" y="48" width="176" height="176" rx="20" ry="20" style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/>
          <rect x="288" y="48" width="176" height="176" rx="20" ry="20" style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/>
          <rect x="48" y="288" width="176" height="176" rx="20" ry="20" style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/>
          <rect x="288" y="288" width="176" height="176" rx="20" ry="20" style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/>
        </svg>
      `,
      title: 'Layout',
    };
  }

  #config!: LayoutBlockToolConfig;
  #readOnly: boolean;
  #wrapper: HTMLDivElement;

  #itemContent: LayoutBlockItemContentData;
  #layout: LayoutBlockContainerData;
  blockAPI: BlockAPI;

  constructor({
    config,
    data,
    readOnly,
    block,
  }: BlockToolConstructorOptions<LayoutBlockToolData, LayoutBlockToolConfig>) {
    this.#readOnly = readOnly;
    this.#wrapper = document.createElement('div');
    if (block) {
      this.blockAPI = block;
    }
    this.#itemContent = {};

    this.#layout = {
      type: 'container',
      id: '',
      className: '',
      style: '',
      children: [],
    };

    // Filter undefined and empty object.
    // See also: https://github.com/codex-team/editor.js/issues/1432
    if (config && 'EditorJS' in config) {
      this.#config = config;
      this.#itemContent = config.initialData.itemContent;

      if (config.initialData.layout) {
        this.#layout = config.initialData.layout;
      }
    }

    // Filter undefined and empty object.
    // See also: https://github.com/codex-team/editor.js/issues/1432
    if (data && 'itemContent' in data) {
      this.#itemContent = data.itemContent;

      if (data.layout) {
        this.#layout = data.layout;
      }
    }
  }

  render() {
    this.renderWrapper();

    return this.#wrapper;
  }

  save(): LayoutBlockToolData {
    return {
      itemContent: this.#itemContent,
      layout: this.#config.enableLayoutSaving ? this.#layout : undefined,
    };
  }

  validate(data: LayoutBlockToolData) {
    const compatibilityCheck: ValidatedLayoutBlockToolData = data;

    return true;
  }

  #dispatchData: LayoutBlockToolDispatchData = (action) => {
    const data = action({
      itemContent: this.#itemContent,
      layout: this.#layout,
    });

    this.#itemContent = data.itemContent;
    this.#layout = data.layout;

    this.renderWrapper();
  };

  renderWrapper() {
    this.#wrapper.innerHTML = '';

    this.#wrapper.append(
      renderContainer({
        EditorJS: this.#config.EditorJS,
        data: this.#layout,
        dispatchData: this.#dispatchData,
        editorJSConfig: this.#config.editorJSConfig,
        itemContentData: this.#itemContent,
        readOnly: this.#readOnly,
      })
    );
  }

  renderSettings() {
    const numberOfCols = Object.keys(this.#itemContent).length;
    const block = this;

    const settings: TunesMenuConfigItem[] = [
      {
        name: 'addColumn',
        label: t('Add column'),
        icon: `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `,
        closeOnActivate: true,
        onActivate(item, event) {
          const id = numberOfCols;

          block.#itemContent = {
            ...block.#itemContent,
            [id]: {
              blocks: [],
            },
          };

          block.#layout.children = [
            ...block.#layout.children,
            {
              type: 'item',
              id: String(id),
              className: 'editor-js__layout__item',
              itemContentId: String(id),
              style: '',
            },
          ];

          block.renderWrapper();
        },
      },
      {
        name: 'removeColumn',
        title: t('Remove column'),
        isDisabled: numberOfCols === 2,
        confirmation: {
          title: t('Really remove?'),
          icon: `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          `,
          closeOnActivate: true,
          onActivate(item, event) {
            block.#itemContent = sliceObject(block.#itemContent, 0, -1);
            block.#layout.children = block.#layout.children.slice(0, -1);

            block.renderWrapper();
          },
        },
        icon: `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `,
      },
    ];

    return settings;
  }
}

export { LayoutBlockTool };
export type {
  LayoutBlockToolConfig,
  LayoutBlockToolData,
  LayoutBlockToolDispatchData,
  ValidatedLayoutBlockToolData,
};
