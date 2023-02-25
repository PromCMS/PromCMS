import type { OutputData } from '@editorjs/editorjs';
import { v4 as uuidv4 } from 'uuid';
import type { LayoutBlockToolConfig } from '../LayoutBlockTool';

const createDialog = ({
  EditorJS,
  data,
  editorJSConfig,
  onClose,
}: {
  EditorJS: LayoutBlockToolConfig['EditorJS'];
  data: OutputData;
  editorJSConfig: LayoutBlockToolConfig['editorJSConfig'];
  onClose?: (event: { editorJSData: OutputData }) => void;
}) => {
  const dialog = document.createElement('dialog');
  dialog.classList.add('editor-js--dialog--root');

  const editorJSHolder = document.createElement('div');
  const editorJSHolderID = uuidv4();

  editorJSHolder.id = editorJSHolderID;
  dialog.append(editorJSHolder);

  const editorJS = new EditorJS({
    ...editorJSConfig,
    holder: editorJSHolderID,
    data,
  });

  const handleDialogClick = (event: MouseEvent) => {
    if (!(event.target instanceof Node) || !event.target.isEqualNode(dialog)) {
      return;
    }

    dialog.close();
  };

  dialog.addEventListener('click', handleDialogClick);

  const handleDialogClose = async () => {
    const editorJSData = await editorJS.save();

    editorJS.destroy();

    dialog.removeEventListener('click', handleDialogClick);
    dialog.removeEventListener('close', handleDialogClose);
    dialog.remove();

    onClose?.({ editorJSData });
  };

  dialog.addEventListener('close', handleDialogClose);

  // Create and append close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-9 h-9 block"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>';
  closeButton.classList.add('editor-js--dialog--close-button');

  // Handle click
  const handleCloseButtonClick = () => dialog.close();
  closeButton.addEventListener('click', handleCloseButtonClick);

  dialog.append(closeButton);

  return dialog;
};

export { createDialog };
