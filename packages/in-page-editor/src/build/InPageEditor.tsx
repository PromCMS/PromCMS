import { Root as RootComponent } from './components/Root';
import { createRoot, Root } from 'react-dom/client';
import { DATA_ATTRIBUTE_NAME } from './constants';
import { tw } from 'twind';
import { EditorTypes } from './types';

import './styles.css';
import { SiteStore, useSiteStore } from './store';

export interface InPageEditorOptions {
  /**
   * Existing react root element
   */
  rootElement?: HTMLElement;
  onSave?: SiteStore['onSave'];
}

const triggerToggleEditorNodeEvent: EventListener = (event) => {
  const button = event.currentTarget as HTMLButtonElement;
  const parent = button.parentElement as HTMLElement;
  // Find first div and select as a root
  const root = parent.querySelector('div') as HTMLElement;
  // We could get it through data object but this is easier for us since we can use constant here
  const type = (parent.getAttribute(DATA_ATTRIBUTE_NAME) ??
    'text') as EditorTypes;

  useSiteStore.getState().updateEditNode({
    type,
    button,
    // Find first div and select as a root
    root,
  });
};

export class InPageEditor {
  root: Root;

  private registerEvents() {
    // Find all elements
    const elements = document.querySelectorAll(`*[${DATA_ATTRIBUTE_NAME}]`);

    // Create reusable element
    const buttonElement = document.createElement('button');

    // Add some flawor
    buttonElement.setAttribute(
      'class',
      tw`rounded-l-xl p-3 absolute -left-2 top-0 -translate-x-full focus:outline-none `
    );

    // Add SVG pencil
    buttonElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pencil" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" /><line x1="13.5" y1="6.5" x2="17.5" y2="10.5" /></svg>
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-check" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>
    `;

    // Add button to each edit node
    for (const element of elements) {
      const clonnedButton = buttonElement.cloneNode(true);
      clonnedButton.addEventListener('click', triggerToggleEditorNodeEvent);

      // Wrap all elements to new root so we can easily use tools like ckeditor
      const newRoot = document.createElement('div');
      newRoot.innerHTML = element.innerHTML;

      element.innerHTML = '';
      element.append(newRoot, clonnedButton);
    }
  }

  constructor({
    rootElement = document.createElement('div'),
    onSave,
  }: InPageEditorOptions = {}) {
    document.body.appendChild(rootElement);

    // Add items from config
    useSiteStore.getState().updateValues({
      onSave,
    });

    this.root = createRoot(rootElement);
  }

  render() {
    this.registerEvents();

    this.root.render(<RootComponent />);
  }
}
