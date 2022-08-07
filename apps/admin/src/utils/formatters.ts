import dayjs from 'dayjs';

/**
 * Formats a human name to two initials
 * @param name Desired human name to be formatted
 * @returns Initials, a string of max length of 2
 */
export const getInitials = (name: string) => {
  const humanNamePieces = name.split(' ');

  if (humanNamePieces.length === 0) return '';

  return `${humanNamePieces[0].charAt(0)}${(
    humanNamePieces.pop() as string
  ).charAt(0)}`;
};

/**
 * Accepts data in number (unix) or date string
 */
export const dynamicDayjs = (dynamicDate: string | number) =>
  typeof dynamicDate === 'number'
    ? dayjs.unix(dynamicDate)
    : dayjs(dynamicDate);
