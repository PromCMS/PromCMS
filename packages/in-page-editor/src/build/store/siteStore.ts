import { EDIT_ACTIVE_CLASS, EDIT_ACTIVE_ROOT_CLASS } from '../constants';
import { EditNode } from '../types';
import create from 'zustand';

export type SiteStore = {
  editNode?: EditNode;
  isSaving?: boolean;
  onSave?: (content: EditNode) => Promise<void> | void;
  save: () => Promise<void>;
  updateEditNode: (editNode: EditNode) => void;
  updateValues: (
    state: Partial<Omit<SiteStore, 'updateValues' | 'save' | 'updateEditNode'>>
  ) => void;
};

export const useSiteStore = create<SiteStore>((set, get) => ({
  isSaving: false,
  async updateEditNode(editNode) {
    const { button, root } = editNode;
    const body = document.body;
    const parent = button.parentElement as HTMLElement;
    const prevNode = get().editNode;

    if (body.classList.contains(EDIT_ACTIVE_CLASS)) {
      const clickedActiveButton = parent.classList.contains(
        EDIT_ACTIVE_ROOT_CLASS
      );

      if (clickedActiveButton) {
        await this.save();
        body.classList.remove(EDIT_ACTIVE_CLASS);
        parent.classList.remove(EDIT_ACTIVE_ROOT_CLASS);

        useSiteStore.getState().updateValues({
          editNode: undefined,
        });
      } else {
        await this.save();
        // Remove className from previous
        if (prevNode) {
          prevNode.button.parentElement!.classList.remove(
            EDIT_ACTIVE_ROOT_CLASS
          );
        }
        parent.classList.add(EDIT_ACTIVE_ROOT_CLASS);

        useSiteStore.getState().updateValues({
          editNode,
        });
      }
    } else {
      // We need to toggle editor
      body.classList.add(EDIT_ACTIVE_CLASS);
      parent.classList.add(EDIT_ACTIVE_ROOT_CLASS);

      useSiteStore.getState().updateValues({
        editNode,
      });
    }
  },
  async save() {
    set({ isSaving: true });

    if (get().editNode && get().onSave) {
      await Promise.resolve(get().onSave);
    }

    set({ isSaving: false });
  },
  updateValues(newValues) {
    set(newValues);
  },
}));
