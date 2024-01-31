import {
  AlignCenter,
  AlignJustified,
  AlignLeft,
  AlignRight,
  H2,
  H3,
  H4,
  Icon,
} from 'tabler-icons-react';

export const ALLOWED_HEADING_LEVELS = [2, 3, 4] as const;
export const ALLOWED_TEXT_ALIGNS = [
  'left',
  'center',
  'right',
  'justify',
] as const;
export const TEXT_ALIGN_TO_ICON: Record<
  (typeof ALLOWED_TEXT_ALIGNS)[number],
  Icon
> = {
  left: AlignLeft,
  center: AlignCenter,
  right: AlignRight,
  justify: AlignJustified,
};
export const HEADING_LEVEL_TO_ICON: Record<
  (typeof ALLOWED_HEADING_LEVELS)[number],
  Icon
> = {
  2: H2,
  3: H3,
  4: H4,
};
