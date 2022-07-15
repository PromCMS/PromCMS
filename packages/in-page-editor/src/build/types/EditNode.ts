export type EditorTypes = 'text' | 'image';

export interface EditNode {
  button: HTMLButtonElement;
  root: HTMLElement;
  type: EditorTypes;
}
