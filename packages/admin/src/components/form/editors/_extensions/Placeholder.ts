import { MESSAGES } from '@constants';
import { Placeholder as PlaceholderBase } from '@tiptap/extension-placeholder';
import { t } from 'i18next';

export const Placeholder = PlaceholderBase.configure({
  placeholder: ({ node }) => {
    if (node.type.name === 'heading') {
      return t(MESSAGES.PLACEHOLDER_TITLE);
    }

    return t(MESSAGES.PLACEHOLDER_PARAGRAPH);
  },
});
