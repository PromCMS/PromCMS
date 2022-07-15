import { FC } from 'react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { useEffect } from 'react';
import { useSiteStore } from '../store';

export const App: FC = () => {
  const [editNode] = useSiteStore((state) => [state.editNode]);

  useEffect(() => {
    let editor: InlineEditor;

    const initializeEditor = async () => {
      try {
        editor = await InlineEditor.create(editNode!.root, {
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'undo',
            'redo',
            'numberedList',
            'bulletedList',
          ],
        });
      } catch (e) {
        console.error({ e });
      }
    };

    console.log({ editNode });

    if (editNode && editNode.type === 'text') {
      initializeEditor();
    }

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editNode]);

  return <></>;
};
