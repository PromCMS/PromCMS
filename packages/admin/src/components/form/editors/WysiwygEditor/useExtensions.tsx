import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '../_extensions/Placeholder';

export const useExtensions = () => {
  const { t } = useTranslation();

  return useMemo(
    () => [
      StarterKit.configure(),
      Placeholder,
      Link.configure({ linkOnPaste: true, openOnClick: false }),

      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    [t]
  );
};
