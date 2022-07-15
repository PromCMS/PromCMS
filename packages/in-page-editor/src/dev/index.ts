import { InPageEditor } from '../build/InPageEditor';
import './index.css';

(() => {
  const editor = new InPageEditor({
    onSave(c) {
      console.log({ c });
    },
  });

  editor.render();
})();
