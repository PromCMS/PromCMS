import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Placeholder } from '../_extensions/Placeholder';

export const useExtensions = () => {
  const { t } = useTranslation();

  return useMemo(
    () => [
      StarterKit.configure(),
      Placeholder,
      Link.configure({ linkOnPaste: true, openOnClick: false }),
      // Placeholder.configure({
      //   placeholder: ({ node }) => {
      //     if (node.type.name === 'heading') {
      //       return t(MESSAGES.PLACEHOLDER_TITLE);
      //     }

      //     return t(MESSAGES.PLACEHOLDER_PARAGRAPH);
      //   },
      // }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    [t]
  );
};
